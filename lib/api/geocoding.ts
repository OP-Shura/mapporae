import { Coordinates } from '@/lib/types';

export interface GeocodingResult {
  displayName: string;
  name: string;
  coordinates: Coordinates;
  type: string;
  source?: string;
}

/**
 * Curated local Varanasi presets.
 * Used for instant, zero-network local search suggestions in the browser.
 */
export const VARANASI_PRESET_LOCATIONS: GeocodingResult[] = [
  {
    name: 'Dashashwamedh Ghat',
    displayName: 'Dashashwamedh Ghat, Godowlia, Varanasi',
    coordinates: { lat: 25.3072, lng: 83.0104 },
    type: 'ghat',
  },
  {
    name: 'Assi Ghat',
    displayName: 'Assi Ghat, Shivala, Varanasi',
    coordinates: { lat: 25.2891, lng: 83.0066 },
    type: 'ghat',
  },
  {
    name: 'Kashi Vishwanath Corridor',
    displayName: 'Kashi Vishwanath Temple, Lahori Tola, Varanasi',
    coordinates: { lat: 25.3109, lng: 83.0107 },
    type: 'temple',
  },
  {
    name: 'BHU Main Gate (Lanka)',
    displayName: 'Lanka Chauraha, Banaras Hindu University, Varanasi',
    coordinates: { lat: 25.2800, lng: 82.9990 },
    type: 'university',
  },
  {
    name: 'Varanasi Cantt Station',
    displayName: 'Varanasi Junction Cantt Railway Station, Varanasi',
    coordinates: { lat: 25.3283, lng: 82.9863 },
    type: 'station',
  },
  {
    name: 'Godowlia Crossing',
    displayName: 'Godowlia Chauraha, Luxa Road, Varanasi',
    coordinates: { lat: 25.3094, lng: 83.0044 },
    type: 'landmark',
  },
  {
    name: 'Manikarnika Ghat',
    displayName: 'Manikarnika Ghat, Manikarnika Gali, Varanasi',
    coordinates: { lat: 25.3106, lng: 83.0142 },
    type: 'ghat',
  },
  {
    name: 'Sankat Mochan Temple',
    displayName: 'Sankat Mochan Hanuman Mandir, Saket Nagar, Varanasi',
    coordinates: { lat: 25.2818, lng: 82.9987 },
    type: 'temple',
  },
  {
    name: 'Sarnath Archaeological Site',
    displayName: 'Sarnath Archaeological Complex & Stupa, Varanasi',
    coordinates: { lat: 25.3811, lng: 83.0214 },
    type: 'heritage',
  },
  {
    name: 'Namo Ghat',
    displayName: 'Namo Ghat (Khidkiya Ghat), Northern Waterfront, Varanasi',
    coordinates: { lat: 25.3347, lng: 83.0331 },
    type: 'ghat',
  }
];

/**
 * Instantly filters bundled local Varanasi preset locations.
 * Safe for client-side typing/input because it executes 100% in-memory with ZERO network requests.
 */
export function filterLocalPresetLocations(query: string): GeocodingResult[] {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  return VARANASI_PRESET_LOCATIONS.filter(
    p => p.name.toLowerCase().includes(clean) || p.displayName.toLowerCase().includes(clean)
  );
}

/**
 * Searches location using the application's internal rate-limited and cached server endpoint (/api/geocode).
 * Executed ONLY on explicit user form submission (Enter / Explore click) — NEVER on keystroke typing.
 */
export async function searchVaranasiLocations(query: string): Promise<GeocodingResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  // Check local presets first (instant return, avoids calling server)
  const localMatches = filterLocalPresetLocations(cleanQuery);
  if (localMatches.length > 0) {
    return localMatches;
  }

  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(cleanQuery)}`);
    if (!res.ok) return localMatches;

    const data = await res.json();
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
  } catch {
    console.warn('[Geocoding Client] Server search failed.');
  }

  return localMatches;
}
