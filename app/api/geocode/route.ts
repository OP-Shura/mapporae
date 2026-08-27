import { NextRequest, NextResponse } from 'next/server';
import { Coordinates } from '@/lib/types';
import { VARANASI_PRESET_LOCATIONS } from '@/lib/api/geocoding';
import { logger } from '@/lib/logger';
import { env } from '@/lib/config/env';
import { sanitizeSearchQuery } from '@/lib/security/sanitize';
import {
  globalRateLimiter,
  getClientIp,
  getRateLimitHeaders,
  RATE_LIMIT_POLICIES,
} from '@/lib/security/rate-limit';

/**
 * ==============================================================================
 * IMPORTANT NOMINATIM POLICY COMPLIANCE NOTICE:
 * Public Nominatim (nominatim.openstreetmap.org) must NEVER be called directly
 * from browser clients or used for live type-ahead/autocomplete queries.
 * 
 * This server-side route:
 * 1. Enforces a global rate limit of at least 1 second between external Nominatim calls.
 * 2. Employs a 24-hour server-side cache.
 * 3. Identifies itself with a valid custom User-Agent.
 * 4. Binds queries strictly to the Varanasi geographic viewbox.
 * 5. Provides a pluggable provider abstraction for future vendor swaps.
 * ==============================================================================
 */

export interface GeocodeResultItem {
  name: string;
  displayName: string;
  coordinates: Coordinates;
  type: string;
  source: 'preset' | 'nominatim' | 'cache' | 'fallback';
}

export interface GeocodingProvider {
  name: string;
  search(query: string): Promise<GeocodeResultItem[]>;
}

interface NominatimRawItem {
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
}

// 24-Hour In-Memory Server Cache
interface CacheEntry {
  data: GeocodeResultItem[];
  expiresAt: number;
}
const serverGeocodeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Per-runtime rate-limiter state (min. 1000 ms between external upstream calls).
let lastNominatimRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1050;
let nominatimQueue: Promise<void> = Promise.resolve();

async function throttleNominatim(): Promise<void> {
  const scheduledRequest = nominatimQueue.then(async () => {
    const delay = Math.max(0, lastNominatimRequestTime + MIN_REQUEST_INTERVAL_MS - Date.now());
    if (delay > 0) {
      await new Promise<void>(resolve => setTimeout(resolve, delay));
    }
    lastNominatimRequestTime = Date.now();
  });

  nominatimQueue = scheduledRequest.catch(() => undefined);
  await scheduledRequest;
}

/**
 * OpenStreetMap Nominatim Provider Implementation
 */
class NominatimProvider implements GeocodingProvider {
  name = 'nominatim';

  constructor(private readonly userAgent: string) {}

  async search(query: string): Promise<GeocodeResultItem[]> {
    await throttleNominatim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query + ', Varanasi, Uttar Pradesh, India'
    )}&format=json&addressdetails=1&limit=5&viewbox=82.85,25.45,83.15,25.15&bounded=1`;

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'User-Agent': this.userAgent,
        'Accept-Language': 'en,hi',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Nominatim upstream returned HTTP ${res.status}`);
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as NominatimRawItem[]).map(item => ({
      name: item.name || item.display_name.split(',')[0],
      displayName: item.display_name,
      coordinates: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
      type: item.type || 'place',
      source: 'nominatim',
    }));
  }
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rateLimitResult = globalRateLimiter.check(clientIp, RATE_LIMIT_POLICIES.GEOCODE);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many search requests. Please slow down.' },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get('q');

  const validation = sanitizeSearchQuery(rawQuery, 2, 100);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'Invalid query parameter "q"' },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  const query = validation.query;
  const normalizedKey = query.toLowerCase();

  // 1. Check local Varanasi presets first (Zero network overhead)
  const matchedPresets = VARANASI_PRESET_LOCATIONS.filter(
    p =>
      p.name.toLowerCase().includes(normalizedKey) ||
      p.displayName.toLowerCase().includes(normalizedKey)
  ).map(p => ({ ...p, source: 'preset' as const }));

  if (matchedPresets.length > 0) {
    logger.info(`Geocode preset hit for "${query}"`, { component: 'GeocodeAPI', action: 'preset_hit' });
    return NextResponse.json({
      results: matchedPresets,
      source: 'preset',
      cached: true,
    });
  }

  // 2. Check 24-hour server cache
  const cached = serverGeocodeCache.get(normalizedKey);
  if (cached && cached.expiresAt > Date.now()) {
    logger.info(`Geocode cache hit for "${query}"`, { component: 'GeocodeAPI', action: 'cache_hit' });
    return NextResponse.json({
      results: cached.data,
      source: 'cache',
      cached: true,
    });
  }

  const userAgent = env.NOMINATIM_USER_AGENT;
  if (!userAgent) {
    return NextResponse.json({
      results: [],
      source: 'disabled',
      cached: false,
      error: 'Live geocoding is not configured. Try a Varanasi landmark or browse the directory.',
    });
  }

  const activeGeocodingProvider: GeocodingProvider = new NominatimProvider(userAgent);

  // 3. Request upstream provider with rate limiting & error shielding
  try {
    const results = await activeGeocodingProvider.search(query);

    if (results.length > 0) {
      serverGeocodeCache.set(normalizedKey, {
        data: results,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      logger.info(`Geocode fetched upstream results for "${query}"`, { component: 'GeocodeAPI', count: results.length });

      return NextResponse.json({
        results,
        source: activeGeocodingProvider.name,
        cached: false,
      });
    }

    return NextResponse.json({
      results: [],
      source: 'fallback',
      cached: false,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown geocoding error';
    logger.warn(`Upstream error for "${query}": ${errMsg}`, { component: 'GeocodeAPI', error: errMsg });
    return NextResponse.json({
      results: matchedPresets,
      source: 'fallback',
      error: 'Upstream geocoding unavailable; no location result was returned.',
      cached: false,
    });
  }
}
