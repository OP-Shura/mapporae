'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeafletMap } from '@/components/map/LeafletMap';
import { FilterDrawer } from '@/components/explore/FilterDrawer';
import { PlaceCard } from '@/components/explore/PlaceCard';
import { PlaceDrawer } from '@/components/explore/PlaceDrawer';
import { SaveModal } from '@/components/ui/SaveModal';
import { VARANASI_PLACES_DATA } from '@/lib/data/places';
import { Place, PlaceCategory, Coordinates } from '@/lib/types';
import { useLocation } from '@/lib/context/LocationContext';
import { calculateDistanceKm } from '@/lib/api/places';
import { 
  Search, 
  Map, 
  List, 
  SlidersHorizontal, 
  Sparkles, 
  X
} from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const { userLocation, effectiveLocation, locationName, isOutsideCoverage } = useLocation();

  const urlCategory = (searchParams.get('category') as PlaceCategory) || 'all';
  const urlQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [radiusKm, setRadiusKm] = useState(15);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'popularity' | 'name'>('distance');

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeModalPlace, setActiveModalPlace] = useState<Place | null>(null);

  // Mobile layout view mode: 'split' | 'map' | 'list'
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    let results = [...VARANASI_PLACES_DATA];

    // Category
    if (selectedCategory !== 'all') {
      results = results.filter(p => p.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    // Open Now
    if (openNowOnly) {
      results = results.filter(p => p.openNow);
    }

    // Radius Filter (uses effectiveLocation in Varanasi)
    if (effectiveLocation && radiusKm > 0) {
      results = results.filter(p => {
        const dist = calculateDistanceKm(effectiveLocation, p.coordinates);
        return dist <= radiusKm;
      });
    }

    // Sort
    results.sort((a, b) => {
      if (sortBy === 'distance' && effectiveLocation) {
        const distA = calculateDistanceKm(effectiveLocation, a.coordinates);
        const distB = calculateDistanceKm(effectiveLocation, b.coordinates);
        return distA - distB;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });

    return results;
  }, [selectedCategory, searchQuery, openNowOnly, radiusKm, sortBy, effectiveLocation]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setRadiusKm(15);
    setOpenNowOnly(false);
    setSortBy('distance');
  };

  // Keep the map aligned with the same in-coverage reference used for filters.
  const mapCenter: Coordinates = selectedPlace
    ? selectedPlace.coordinates
    : effectiveLocation;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      {/* Outside Coverage Notification Notice */}
      {isOutsideCoverage && (
        <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 shadow-xs">
          📍 <strong>Notice:</strong> Mapporae currently covers Varanasi. Showing places relative to Varanasi city centre.
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Varanasi ghats, mandirs, chaat, chemists, ATMs..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#E8D9C0] bg-white focus:outline-none focus:ring-2 focus:ring-[#0E7490] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher (Mobile & Tablet) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-[#E8D9C0] bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-[#172554] text-white' : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-[#172554] text-white' : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({filteredPlaces.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'split' ? 'bg-[#172554] text-white' : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <span>Split</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className={`lg:hidden flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
              isMobileFiltersOpen
                ? 'bg-[#0E7490] border-[#0E7490] text-white'
                : 'border-[#E8D9C0] bg-white text-[#172554]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filters & Places List | Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Sidebar & Place Result Cards */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            viewMode === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Filter Drawer (Always visible on desktop, toggleable on mobile) */}
          <div className={`${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <FilterDrawer
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              radiusKm={radiusKm}
              onChangeRadius={setRadiusKm}
              openNowOnly={openNowOnly}
              onToggleOpenNow={setOpenNowOnly}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              totalResultsCount={filteredPlaces.length}
              onReset={handleResetFilters}
            />
          </div>

          {/* Results Directory Counter */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing {filteredPlaces.length} places
            </span>
            <span className="text-xs text-slate-500">
              Ref: {locationName.split(',')[0]}
            </span>
          </div>

          {/* Place Cards List */}
          {filteredPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8D9C0] bg-[#FAF6EF] p-10 text-center">
              <Sparkles className="w-8 h-8 text-[#D97706] mb-2" />
              <h3 className="text-sm font-bold text-[#172554]">No matching places found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Try widening your distance radius, changing category, or clearing the search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-xl bg-[#0E7490] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredPlaces.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={p => setSelectedPlace(p)}
                  onOpenSaveModal={p => setActiveModalPlace(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Full Interactive Leaflet Map */}
        <div
          className={`lg:col-span-7 sticky top-20 ${
            viewMode === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <LeafletMap
            places={filteredPlaces}
            center={mapCenter}
            zoom={selectedPlace ? 15 : 13}
            selectedPlaceId={selectedPlace?.id}
            onSelectPlace={place => setSelectedPlace(place)}
            userLocation={isOutsideCoverage ? null : userLocation}
            className="h-[550px] lg:h-[calc(100vh-140px)] w-full"
          />
        </div>
      </div>

      {/* Slide-over Place Detail Drawer */}
      <PlaceDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onOpenSaveModal={p => setActiveModalPlace(p)}
      />

      {/* Save Modal */}
      <SaveModal
        place={activeModalPlace}
        isOpen={Boolean(activeModalPlace)}
        onClose={() => setActiveModalPlace(null)}
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center text-sm font-semibold text-[#172554]">
          Loading Varanasi Explore Directory...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
