'use client';

import React from 'react';
import Link from 'next/link';
import { Place } from '@/lib/types';
import { useLocation } from '@/lib/context/LocationContext';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { StatusBadge, OpenBadge, DistanceBadge } from '@/components/ui/Badge';
import { Bookmark, Star, ArrowRight } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect: (place: Place) => void;
  onOpenSaveModal: (place: Place) => void;
}

export function PlaceCard({ place, isSelected, onSelect, onOpenSaveModal }: PlaceCardProps) {
  const { getDistanceTo } = useLocation();
  const { isPlaceSaved } = useSavedPlaces();
  const distance = getDistanceTo(place.coordinates);
  const isSaved = isPlaceSaved(place.id);

  return (
    <div
      onClick={() => onSelect(place)}
      className={`glass-card group relative flex flex-col sm:flex-row items-stretch gap-3.5 rounded-2xl p-3.5 transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-[#0E7490] dark:border-[#38BDF8] bg-[#E0F2FE]/40 dark:bg-[#38BDF8]/15 shadow-lg ring-2 ring-[#0E7490]/30 scale-[1.01]'
          : 'hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Thumbnail with Smooth Zoom */}
      <div className="relative h-40 sm:h-32 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={place.coverImage}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        <div className="absolute top-2 left-2 z-10">
          <StatusBadge
            status={place.status}
            sourceUrl={place.sourceUrl}
            verifiedAt={place.verifiedAt}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
              {place.category}
            </span>

            <div className="flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-xs font-black text-amber-700 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {place.rating}
              </span>
              <span className="text-[10px] text-slate-400">({place.reviewCount})</span>
            </div>
          </div>

          <h3 className="mt-0.5 text-sm font-extrabold text-[#172554] dark:text-white group-hover:text-[#0E7490] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
            {place.name}
          </h3>

          {place.hindiName && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{place.hindiName}</p>
          )}

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-3 flex items-center justify-between border-t border-[#E8D9C0]/60 dark:border-slate-700/60 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <DistanceBadge distanceKm={distance} />
            <OpenBadge isOpen={place.openNow} />
          </div>

          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onOpenSaveModal(place)}
              className={`p-1.5 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95 ${
                isSaved
                  ? 'bg-[#FEF3C7] dark:bg-amber-950/60 border-[#FDE68A] text-[#D97706] dark:text-amber-400'
                  : 'bg-[#FAF6EF] dark:bg-slate-800 border-[#E8D9C0] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0E7490]'
              }`}
              title={isSaved ? 'Saved in list' : 'Save place'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <Link
              href={`/place/${place.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-[#FAF6EF] dark:bg-slate-800 px-2.5 py-1 font-bold text-[#0E7490] dark:text-[#38BDF8] hover:bg-[#E0F2FE] dark:hover:bg-slate-700 transition-all border border-[#E8D9C0] dark:border-slate-700 shadow-2xs hover:scale-105"
            >
              <span>Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
