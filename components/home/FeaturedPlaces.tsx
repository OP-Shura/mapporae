'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Place } from '@/lib/types';
import { useLocation } from '@/lib/context/LocationContext';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { StatusBadge, OpenBadge, DistanceBadge } from '@/components/ui/Badge';
import { SaveModal } from '@/components/ui/SaveModal';
import { Bookmark, Star, ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedPlacesProps {
  places: Place[];
}

export function FeaturedPlaces({ places }: FeaturedPlacesProps) {
  const { getDistanceTo } = useLocation();
  const { isPlaceSaved } = useSavedPlaces();
  const [activeModalPlace, setActiveModalPlace] = useState<Place | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-[#FBBF24]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kashi Highlights</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#172554] dark:text-white">
            Featured Landmarks & Sacred Ghats
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hand-curated heritage spots with visitor tips, maps, and verified timings
          </p>
        </div>

        <Link
          href="/explore"
          className="group inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map(place => {
          const distance = getDistanceTo(place.coordinates);
          const isSaved = isPlaceSaved(place.id);

          return (
            <div
              key={place.id}
              className="glass-card glass-card-interactive group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image & Badges with Frosted Overlays */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.coverImage}
                  alt={place.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Ambient Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                  <StatusBadge
                    status={place.status}
                    sourceUrl={place.sourceUrl}
                    verifiedAt={place.verifiedAt}
                  />
                  <OpenBadge isOpen={place.openNow} />
                </div>

                {/* Quick Save Bookmark Button with Spring Pop */}
                <button
                  type="button"
                  onClick={() => setActiveModalPlace(place)}
                  className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all duration-200 hover:scale-115 active:scale-95 z-10 ${
                    isSaved
                      ? 'bg-[#F59E0B] text-white animate-spring-pop'
                      : 'bg-white/85 dark:bg-slate-900/85 text-[#172554] dark:text-white hover:bg-white hover:text-[#0E7490]'
                  }`}
                  title={isSaved ? 'Saved in list' : 'Save place'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Rating overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-black text-white backdrop-blur-md border border-white/10 z-10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{place.rating}</span>
                  <span className="text-[10px] text-slate-300 font-normal">({place.reviewCount})</span>
                </div>

                <div className="absolute bottom-3 right-3 z-10">
                  <DistanceBadge distanceKm={distance} />
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
                      {place.category}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {place.subCategory}
                    </span>
                  </div>

                  <Link href={`/place/${place.id}`}>
                    <h3 className="mt-1 text-base font-extrabold text-[#172554] dark:text-white group-hover:text-[#0E7490] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                      {place.name}
                    </h3>
                  </Link>

                  {place.hindiName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{place.hindiName}</p>
                  )}

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[#E8D9C0]/80 dark:border-slate-700/80 pt-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium line-clamp-1">
                    {place.timing.split('•')[0]}
                  </span>

                  <Link
                    href={`/place/${place.id}`}
                    className="inline-flex items-center gap-1 font-bold text-[#0E7490] dark:text-[#38BDF8] hover:text-[#155E75] group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Modal */}
      <SaveModal
        place={activeModalPlace}
        isOpen={Boolean(activeModalPlace)}
        onClose={() => setActiveModalPlace(null)}
      />
    </section>
  );
}
