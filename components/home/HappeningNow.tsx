'use client';

import React from 'react';
import { EVENT_SCHEDULES_CONFIG } from '@/lib/config/events';
import { Clock, MapPin, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function HappeningNow() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Rituals & Daily Wonders</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#172554] dark:text-white">
            Happening Along the Ghats
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily Maha Ganga Aarti, Subah-e-Banaras sunrise yoga, and evening boat rides
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
        {EVENT_SCHEDULES_CONFIG.map(event => (
          <div
            key={event.id}
            className="glass-card glass-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Ambient Background Warm Glow */}
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/10 blur-2xl group-hover:scale-125 transition-transform" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] dark:bg-amber-950/50 px-3 py-1 text-xs font-bold text-[#D97706] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-700/60 shadow-2xs backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.currentEffectiveTiming}</span>
                </span>

                <span className="rounded-full bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {event.ticketType} Entry
                </span>
              </div>

              <h3 className="mt-3 text-base font-extrabold text-[#172554] dark:text-white group-hover:text-[#0E7490] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                {event.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{event.hindiTitle}</p>

              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#0E7490] dark:text-[#38BDF8] font-bold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.locationName}</span>
              </div>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.description}
              </p>

              {/* Local Pro Tip Frosted Box */}
              <div className="mt-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 p-3 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 leading-snug backdrop-blur-xs shadow-2xs">
                <div className="flex items-start gap-2">
                  <div className="rounded-lg bg-amber-100 dark:bg-amber-900/60 p-1 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold mr-1 text-[#D97706] dark:text-amber-400">Insider Tip:</span>
                    <span>{event.bestViewingSpot}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-[#E8D9C0]/80 dark:border-slate-700/80 pt-3.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Duration: ~{event.durationMinutes} mins • Daily
              </span>

              <Link
                href={`/explore?q=${encodeURIComponent(event.locationName.split(',')[0])}`}
                className="group/link inline-flex items-center gap-1 font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
              >
                <span>View on Map</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
