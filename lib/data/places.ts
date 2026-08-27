import { Place } from '@/lib/types';
import rawPlacesData from './places.json';

/**
 * Curated Varanasi Places Data Collection.
 * Synchronous reference export for backward compatibility.
 */
export const VARANASI_PLACES_DATA: Place[] = rawPlacesData as Place[];

/**
 * Async Dynamic Importer: Lazily loads or caches places data efficiently.
 */
export async function getVaranasiPlaces(): Promise<Place[]> {
  // If needed, this can dynamically import json to optimize bundle size
  const data = await import('./places.json');
  return data.default as Place[];
}

/**
 * Async Place Lookup by ID
 */
export async function getVaranasiPlaceById(id: string): Promise<Place | undefined> {
  const places = await getVaranasiPlaces();
  return places.find(p => p.id === id);
}

/**
 * Async Filter by Category
 */
export async function getVaranasiPlacesByCategory(category: string): Promise<Place[]> {
  const places = await getVaranasiPlaces();
  if (category === 'all') return places;
  return places.filter(p => p.category === category);
}

/**
 * Async Featured Places
 */
export async function getFeaturedVaranasiPlaces(): Promise<Place[]> {
  const places = await getVaranasiPlaces();
  return places.filter(p => p.isFeatured);
}
