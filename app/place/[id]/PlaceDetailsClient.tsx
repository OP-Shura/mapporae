'use client';

import React, { useState } from 'react';
import { Place } from '@/lib/types';
import { useLocation } from '@/lib/context/LocationContext';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { SaveModal } from '@/components/ui/SaveModal';
import { DistanceBadge } from '@/components/ui/Badge';
import { PlaceReviewsSection } from '@/components/reviews/PlaceReviewsSection';
import { 
  Navigation, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink
} from 'lucide-react';

export function PlaceDetailsClient({ place }: { place: Place }) {
  const { getDistanceTo } = useLocation();
  const { isPlaceSaved } = useSavedPlaces();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const distance = getDistanceTo(place.coordinates);
  const isSaved = isPlaceSaved(place.id);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${place.coordinates.lat}, ${place.coordinates.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${place.name} — Varanasi Guide`,
          text: `Check out ${place.name} on Mapporae`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E8D9C0] bg-white p-4 shadow-xs">
        {/* Distance & GPS coords */}
        <div className="flex items-center gap-3">
          <DistanceBadge distanceKm={distance} />

          <button
            onClick={handleCopyCoords}
            className="flex items-center gap-1 rounded-xl bg-[#FAF6EF] px-3 py-1.5 text-xs font-mono text-slate-700 border border-[#E8D9C0] hover:bg-white transition-colors"
            title="Click to copy GPS coordinates"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}</span>
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-[#0E7490] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#155E75] transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 text-cyan-200" />
          </a>

          <button
            type="button"
            onClick={() => setIsSaveModalOpen(true)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold border transition-colors ${
              isSaved
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                : 'bg-[#FAF6EF] border-[#E8D9C0] text-[#172554] hover:bg-[#E0F2FE]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved in List' : 'Save Place'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-[#E8D9C0] dark:border-slate-700 bg-[#FAF6EF] dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0E7490] transition-colors"
          >
            {shareSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{shareSuccess ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Community Reviews Section */}
        <PlaceReviewsSection placeId={place.id} placeName={place.name} />
      </div>

      {/* Save Modal */}
      <SaveModal
        place={place}
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </>
  );
}
