import React from 'react';
import type { Metadata } from 'next';
import { WalkingTours } from '@/components/tours/WalkingTours';
import { BoatFareCalculator } from '@/components/tours/BoatFareCalculator';
import { AartiCountdown } from '@/components/tours/AartiCountdown';
import { Footprints, Anchor, Flame, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Walking Trails & Boat Fare Calculator — Mapporae Varanasi',
  description:
    'Explore curated Varanasi heritage walking trails from Assi to Dashashwamedh, estimate fair Ganga boat fares, and track live Subah-e-Banaras and Sandhya Aarti countdowns.',
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-12">
      {/* Hero Header */}
      <div className="rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-gradient-to-br from-[#FAF6EF] via-white to-[#F4E7D3]/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
          <Compass className="w-4 h-4 text-[#F59E0B]" />
          <span>Curated Kashi Itineraries & Transit</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#172554] dark:text-white tracking-tight leading-tight">
          Heritage Walking Trails, Boat Tariffs & Aarti Schedules
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Navigate the ancient ghats, vibrant galis, and sacred Ganga waters with confidence. Get verified fair boat fares, step-by-step walking trails, and real-time Aarti countdowns.
        </p>
      </div>

      {/* 1. Live Aarti Countdown Timers */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#172554] dark:text-white">
              Live Ganga Aarti Countdowns
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Timings for the world-famous morning and evening riverfront rituals.
            </p>
          </div>
        </div>

        <AartiCountdown />
      </section>

      {/* 2. Boat Fare & Tariff Calculator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E0F2FE] dark:bg-cyan-950/80 text-[#0E7490] dark:text-[#38BDF8]">
            <Anchor className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#172554] dark:text-white">
              Fair Boat Tariff & Fare Calculator
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Estimate official and fair market rates before boarding on the ghats.
            </p>
          </div>
        </div>

        <BoatFareCalculator />
      </section>

      {/* 3. Curated Heritage Walking Trails */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
            <Footprints className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#172554] dark:text-white">
              Curated Heritage Walking Trails
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Step-by-step pedestrian itineraries through the ghats and historical galis.
            </p>
          </div>
        </div>

        <WalkingTours />
      </section>
    </div>
  );
}
