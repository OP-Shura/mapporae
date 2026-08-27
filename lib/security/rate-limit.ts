/**
 * ==============================================================================
 * Mapporae Security: In-Memory Sliding-Window Rate Limiter
 * ==============================================================================
 * Provides defense-in-depth protection against brute force, denial of service,
 * and endpoint abuse across API routes, auth callbacks, and server actions.
 */

export interface RateLimitPolicy {
  /** Maximum number of allowed requests within the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom key prefix for namespace separation */
  prefix?: string;
}

export interface RateLimitResult {
  /** True if the request is permitted; false if rate limited */
  allowed: boolean;
  /** Max requests configured for this policy */
  limit: number;
  /** Remaining requests available in the current window */
  remaining: number;
  /** Unix timestamp in ms when the window resets */
  resetTimeMs: number;
  /** Seconds until the client may retry (0 if allowed) */
  retryAfterSec: number;
}

interface WindowRecord {
  timestamps: number[];
}

/**
 * Predefined rate limiting policies
 */
export const RATE_LIMIT_POLICIES = {
  /** Auth routes: Max 5 attempts per 15 minutes per IP (Brute force defense) */
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    prefix: 'auth',
  } satisfies RateLimitPolicy,

  /** General API routes: Max 60 requests per minute per IP */
  API: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    prefix: 'api',
  } satisfies RateLimitPolicy,

  /** Geocoding upstream endpoint: Max 30 requests per minute per IP */
  GEOCODE: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    prefix: 'geo',
  } satisfies RateLimitPolicy,

  /** Global baseline: Max 200 requests per minute */
  GLOBAL: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
    prefix: 'global',
  } satisfies RateLimitPolicy,
} as const;

export class RateLimiter {
  private store = new Map<string, WindowRecord>();
  private lastCleanupTime = Date.now();
  private readonly cleanupIntervalMs: number;

  constructor(cleanupIntervalMs = 60 * 1000) {
    this.cleanupIntervalMs = cleanupIntervalMs;
  }

  /**
   * Evaluates if a request from the given identifier is permitted under policy
   */
  public check(identifier: string, policy: RateLimitPolicy): RateLimitResult {
    const now = Date.now();
    this.periodicCleanup(now);

    const key = `${policy.prefix || 'rl'}:${identifier}`;
    const windowStart = now - policy.windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    const currentCount = record.timestamps.length;
    const resetTimeMs = record.timestamps.length > 0 
      ? record.timestamps[0] + policy.windowMs 
      : now + policy.windowMs;

    if (currentCount >= policy.maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));
      return {
        allowed: false,
        limit: policy.maxRequests,
        remaining: 0,
        resetTimeMs,
        retryAfterSec,
      };
    }

    // Record this successful attempt
    record.timestamps.push(now);
    const remaining = Math.max(0, policy.maxRequests - record.timestamps.length);

    return {
      allowed: true,
      limit: policy.maxRequests,
      remaining,
      resetTimeMs,
      retryAfterSec: 0,
    };
  }

  /**
   * Resets rate limit records for testing or administrative unblocking
   */
  public reset(identifier?: string, prefix?: string): void {
    if (!identifier) {
      this.store.clear();
      return;
    }
    const key = `${prefix || 'rl'}:${identifier}`;
    this.store.delete(key);
  }

  /**
   * Periodically cleans up expired records to avoid memory growth
   */
  private periodicCleanup(now: number): void {
    if (now - this.lastCleanupTime < this.cleanupIntervalMs) {
      return;
    }
    this.lastCleanupTime = now;

    const maxWindowMs = 24 * 60 * 60 * 1000; // 24hr absolute upper bound
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter(ts => now - ts < maxWindowMs);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// Global Singleton RateLimiter instance
export const globalRateLimiter = new RateLimiter();

/**
 * Extracts client IP address reliably from incoming request headers
 */
export function getClientIp(headers: Headers): string {
  // 1. Check standard proxy headers
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp && isValidIp(firstIp)) {
      return firstIp;
    }
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp && isValidIp(xRealIp.trim())) {
    return xRealIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  return '127.0.0.1';
}

/**
 * Validates whether a string resembles an IPv4 or IPv6 address
 */
function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  // IPv4 or IPv6 basic validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^[a-fA-F0-9:]+$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Formats standard IETF / draft rate limiting HTTP headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTimeMs / 1000)),
  };

  if (!result.allowed) {
    headers['Retry-After'] = String(result.retryAfterSec);
  }

  return headers;
}
