import { Coordinates, Place, PlaceCategory } from '@/lib/types';
import { VARANASI_PLACES_DATA } from '@/lib/data/places';

export interface PlaceFilterOptions {
  category?: PlaceCategory | 'all';
  searchQuery?: string;
  userLocation?: Coordinates | null;
  radiusKm?: number;
  openNowOnly?: boolean;
  sortBy?: 'distance' | 'rating' | 'popularity' | 'name';
}

/**
 * Calculates geographical distance between two GPS coordinates using the Haversine formula.
 * Returns distance in kilometers (rounded to 1 decimal place).
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Filter and sort places with optional distance calculation and keyword search.
 * 
 * Future Integration Note:
 * - Overpass API / OSM: can query `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radius},${lat},${lng})[${tag}];out;`
 * - Supabase: `const { data, error } = await supabase.from('places').select('*')...`
 */
export async function getPlaces(options: PlaceFilterOptions = {}): Promise<Place[]> {
  const {
    category = 'all',
    searchQuery = '',
    userLocation = null,
    radiusKm = 15,
    openNowOnly = false,
    sortBy = 'distance',
  } = options;

  let results = [...VARANASI_PLACES_DATA];

  // 1. Category Filter
  if (category && category !== 'all') {
    results = results.filter(place => place.category === category);
  }

  // 2. Keyword Search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    results = results.filter(
      place =>
        place.name.toLowerCase().includes(query) ||
        (place.hindiName && place.hindiName.toLowerCase().includes(query)) ||
        place.description.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query) ||
        (place.subCategory && place.subCategory.toLowerCase().includes(query))
    );
  }

  // 3. Open Now Filter
  if (openNowOnly) {
    results = results.filter(place => place.openNow);
  }

  // 4. Distance Radius Filter (if user location provided)
  if (userLocation && radiusKm > 0) {
    results = results.filter(place => {
      const distance = calculateDistanceKm(userLocation, place.coordinates);
      return distance <= radiusKm;
    });
  }

  // 5. Sorting
  results.sort((a, b) => {
    if (sortBy === 'distance' && userLocation) {
      const distA = calculateDistanceKm(userLocation, a.coordinates);
      const distB = calculateDistanceKm(userLocation, b.coordinates);
      return distA - distB;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'popularity') {
      return b.reviewCount - a.reviewCount;
    }
    return a.name.localeCompare(b.name);
  });

  return results;
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const place = VARANASI_PLACES_DATA.find(p => p.id === id);
  return place || null;
}

export async function getFeaturedPlaces(): Promise<Place[]> {
  return VARANASI_PLACES_DATA.filter(p => p.isFeatured);
}

export async function getRelatedPlaces(placeId: string, limit: number = 4): Promise<Place[]> {
  const target = VARANASI_PLACES_DATA.find(p => p.id === placeId);
  if (!target) return VARANASI_PLACES_DATA.slice(0, limit);

  return VARANASI_PLACES_DATA
    .filter(p => p.id !== placeId && (p.category === target.category || p.isFeatured))
    .slice(0, limit);
}
