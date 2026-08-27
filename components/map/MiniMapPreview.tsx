'use client';

import React from 'react';
import { LeafletMap } from './LeafletMap';
import { Place, Coordinates } from '@/lib/types';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

interface MiniMapPreviewProps {
  places: Place[];
  center?: Coordinates;
  zoom?: number;
  height?: string;
  showExploreLink?: boolean;
}

export function MiniMapPreview({
  places,
  center = { lat: 25.3072, lng: 83.0104 },
  zoom = 13,
  height = 'h-72',
  showExploreLink = true,
}: MiniMapPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8D9C0] bg-[#FAF6EF] shadow-sm">
      <LeafletMap
        places={places}
        center={center}
        zoom={zoom}
        className={`${height} w-full`}
      />

      {showExploreLink && (
        <div className="absolute bottom-3 right-3 z-[400]">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-[#1E3A8A] hover:scale-[1.02]"
          >
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Open Full Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
