'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Coordinates, Place } from '@/lib/types';
import { Compass } from 'lucide-react';

interface LeafletMapProps {
  places: Place[];
  center: Coordinates;
  zoom?: number;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: Place) => void;
  userLocation?: Coordinates | null;
  className?: string;
}

const DynamicMap = dynamic(() => import('@/components/map/LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-2xl border border-[#E8D9C0] bg-[#FAF6EF] p-8 text-center shadow-xs">
      <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0E7490] animate-pulse">
        <Compass className="h-7 w-7 animate-spin duration-1000" />
      </div>
      <h4 className="text-sm font-bold text-[#172554]">Loading Varanasi Map...</h4>
      <p className="mt-1 text-xs text-slate-500">Connecting OpenStreetMap & CARTO tiles</p>
    </div>
  ),
});

export function LeafletMap(props: LeafletMapProps) {
  return <DynamicMap {...props} />;
}
