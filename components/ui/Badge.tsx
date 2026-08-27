import React from 'react';
import { PlaceStatus } from '@/lib/types';
import { Sparkles, CheckCircle2, MapPin } from 'lucide-react';

interface StatusBadgeProps {
  status: PlaceStatus;
  sourceUrl?: string;
  verifiedAt?: string;
  className?: string;
}

export function StatusBadge({ status, sourceUrl, verifiedAt, className = '' }: StatusBadgeProps) {
  // Strict Production Safeguard: Show "Verified" ONLY when confirmed with official sourceUrl and verifiedAt timestamp
  if (status === 'verified' && sourceUrl && verifiedAt) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Verified
      </span>
    );
  }

  // Default to curated
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[#FAF6EF] px-2 py-0.5 text-xs font-medium text-[#172554] border border-[#E8D9C0] ${className}`}>
      <Sparkles className="w-3 h-3 text-[#F59E0B]" />
      Curated
    </span>
  );
}

export function OpenBadge({ isOpen }: { isOpen?: boolean }) {
  if (isOpen === undefined) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
        isOpen
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-slate-100 text-slate-700 border-slate-300'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}

export function DistanceBadge({ distanceKm }: { distanceKm?: number }) {
  if (distanceKm === undefined || isNaN(distanceKm)) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6EF] px-2 py-0.5 text-xs font-medium text-[#172554] border border-[#E8D9C0]">
      <MapPin className="w-3 h-3 text-[#0E7490]" />
      {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm} km`}
    </span>
  );
}
