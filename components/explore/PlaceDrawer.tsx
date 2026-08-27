'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Place } from '@/lib/types';
import { useLocation } from '@/lib/context/LocationContext';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { StatusBadge, OpenBadge, DistanceBadge } from '@/components/ui/Badge';
import { 
  X, 
  Navigation, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface PlaceDrawerProps {
  place: Place | null;
  onClose: () => void;
  onOpenSaveModal: (place: Place) => void;
}

export function PlaceDrawer({ place, onClose, onOpenSaveModal }: PlaceDrawerProps) {
  const { getDistanceTo } = useLocation();
  const { isPlaceSaved } = useSavedPlaces();
  const [copiedCoords, setCopiedCoords] = useState(false);

  if (!place) return null;

  const distance = getDistanceTo(place.coordinates);
  const isSaved = isPlaceSaved(place.id);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${place.coordinates.lat}, ${place.coordinates.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `Check out ${place.name} on Mapporae (Varanasi Guide)`,
          url: window.location.origin + `/place/${place.id}`,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/place/${place.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl border-l border-[#E8D9C0] animate-in slide-in-from-right duration-250">
      {/* Top Image Banner */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={place.coverImage}
          alt={place.name}
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status & Category */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <StatusBadge
            status={place.status}
            sourceUrl={place.sourceUrl}
            verifiedAt={place.verifiedAt}
          />
          <OpenBadge isOpen={place.openNow} />
        </div>

        {/* Header Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
            {place.category} • {place.subCategory}
          </span>
          <h2 className="text-xl font-bold leading-tight">{place.name}</h2>
          {place.hindiName && (
            <p className="text-xs text-slate-200">{place.hindiName}</p>
          )}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Metric Badges Row */}
        <div className="flex items-center justify-between border-b border-[#E8D9C0] pb-3 text-xs">
          <DistanceBadge distanceKm={distance} />

          <button
            onClick={handleCopyCoordinates}
            className="flex items-center gap-1 rounded-md bg-[#FAF6EF] px-2 py-1 text-[11px] font-mono text-slate-600 border border-[#E8D9C0] hover:bg-white transition-colors"
            title="Copy GPS coordinates"
          >
            {copiedCoords ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}</span>
          </button>
        </div>

        {/* Timing & Address */}
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#0E7490] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#172554]">Timings:</span>
              <p className="mt-0.5">{place.timing}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0E7490] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#172554]">Address:</span>
              <p className="mt-0.5">{place.address}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl bg-white p-3.5 border border-[#E8D9C0] text-xs text-slate-700 leading-relaxed">
          <h4 className="font-bold text-[#172554] mb-1">About this place</h4>
          <p>{place.description}</p>
        </div>

        {/* Visitor Tip */}
        {place.visitorTip && (
          <div className="rounded-xl bg-amber-50/90 p-3.5 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>Visitor Tip</span>
            </div>
            <p>{place.visitorTip}</p>
          </div>
        )}

        {/* Amenities */}
        {place.amenities && place.amenities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-[#172554] uppercase tracking-wider mb-2">
              Features & Amenities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {place.amenities.map(am => (
                <span
                  key={am}
                  className="rounded-lg bg-[#FAF6EF] px-2.5 py-1 text-[11px] font-medium text-[#172554] border border-[#E8D9C0]"
                >
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source and Review Date Section */}
        <div className="rounded-xl bg-[#FAF6EF] p-3 border border-[#E8D9C0] text-xs space-y-1 text-slate-600">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#172554]">Data Hygiene:</span>
            <span className="text-slate-500">
              Curated record · Last reviewed {new Date(place.lastUpdated).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          {place.sourceName && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8D9C0]/60">
              <span className="text-slate-500">Source:</span>
              {place.sourceUrl ? (
                <a
                  href={place.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0E7490] hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>{place.sourceName}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-slate-700">{place.sourceName}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="border-t border-[#E8D9C0] bg-white p-4 flex items-center gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0E7490] py-2.5 text-xs font-semibold text-white hover:bg-[#155E75] shadow-xs transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Directions</span>
        </a>

        <button
          type="button"
          onClick={() => onOpenSaveModal(place)}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold border transition-colors ${
            isSaved
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
              : 'bg-[#FAF6EF] border-[#E8D9C0] text-[#172554] hover:bg-[#E0F2FE]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9C0] bg-[#FAF6EF] text-slate-600 hover:text-[#0E7490] hover:bg-white transition-colors"
          title="Share place"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <Link
          href={`/place/${place.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172554] text-white hover:bg-[#1E3A8A] transition-colors"
          title="Open Full Page Guide"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
