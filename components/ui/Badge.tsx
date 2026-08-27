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
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 shadow-2xs backdrop-blur-md ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        Verified
      </span>
    );
  }

  // Default to curated
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-[#E8D9C0] dark:border-slate-700 shadow-2xs backdrop-blur-md ${className}`}>
      <Sparkles className="w-3 h-3 text-[#F59E0B]" />
      Curated
    </span>
  );
}

export function OpenBadge({ isOpen }: { isOpen?: boolean }) {
  if (isOpen === undefined) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border shadow-2xs backdrop-blur-md ${
        isOpen
          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
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
    <span className="inline-flex items-center gap-1 rounded-xl bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-[#E8D9C0] dark:border-slate-700 shadow-2xs backdrop-blur-md">
      <MapPin className="w-3 h-3 text-[#0E7490] dark:text-[#38BDF8]" />
      {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm} km`}
    </span>
  );
}
