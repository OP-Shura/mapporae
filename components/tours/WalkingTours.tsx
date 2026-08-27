'use client';

import React, { useState } from 'react';
import { HERITAGE_TRAILS, HeritageTrail } from '@/lib/data/trails';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Footprints, 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  CheckCircle,
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export function WalkingTours() {
  const { isHindi } = useLanguage();
  const [selectedTrail, setSelectedTrail] = useState<HeritageTrail>(HERITAGE_TRAILS[0]);
  const [checkedStops, setCheckedStops] = useState<Record<string, boolean>>({});

  const toggleStop = (stopId: string) => {
    setCheckedStops(prev => ({
      ...prev,
      [stopId]: !prev[stopId],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Trail Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HERITAGE_TRAILS.map(trail => {
          const isSelected = selectedTrail.id === trail.id;

          return (
            <button
              key={trail.id}
              type="button"
              onClick={() => setSelectedTrail(trail)}
              className={`group relative overflow-hidden rounded-3xl border text-left transition-all ${
                isSelected
                  ? 'border-[#0E7490] dark:border-[#38BDF8] shadow-md ring-2 ring-[#0E7490]/20'
                  : 'border-[#E8D9C0] dark:border-slate-800 hover:border-[#0E7490]/50'
              }`}
            >
              {/* Cover Image */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trail.coverImage}
                  alt={trail.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white">
                  <Footprints className="w-3 h-3 text-[#F59E0B]" />
                  <span>{trail.distanceKm} km</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm font-bold leading-tight">
                    {isHindi ? trail.hindiTitle : trail.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta */}
              <div className="bg-[#FAF6EF] dark:bg-slate-900 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {isHindi ? trail.hindiSubtitle : trail.subtitle}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-[#E8D9C0]/60 dark:border-slate-800 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {trail.estimatedDurationMins} mins
                  </span>
                  <span className="font-semibold text-[#0E7490] dark:text-[#38BDF8]">
                    {trail.stops.length} {isHindi ? 'पड़ाव' : 'Stops'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Trail Details & Interactive Waypoints */}
      <div className="rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF] dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        {/* Trail Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8D9C0] dark:border-slate-800 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E0F2FE] dark:bg-cyan-950/80 px-2.5 py-0.5 text-xs font-bold text-[#0E7490] dark:text-cyan-300">
                {selectedTrail.difficulty} {isHindi ? 'कठिनाई' : 'Walk'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {selectedTrail.distanceKm} km • ~{selectedTrail.estimatedDurationMins} mins
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#172554] dark:text-white">
              {isHindi ? selectedTrail.hindiTitle : selectedTrail.title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi ? selectedTrail.hindiDescription : selectedTrail.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <Link
              href={`/explore?lat=${selectedTrail.stops[0].coordinates.lat}&lng=${selectedTrail.stops[0].coordinates.lng}&zoom=15`}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#172554] dark:bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#1E3A8A] transition-all"
            >
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span>{isHindi ? 'मानचित्र पर देखें' : 'View on Live Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Best Time Tip */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>{isHindi ? 'सर्वोत्तम समय: ' : 'Recommended walking time: '}</strong>
            {isHindi ? selectedTrail.hindiBestTime : selectedTrail.bestTimeToWalk}
          </span>
        </div>

        {/* Interactive Stops Checklist Timeline */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {isHindi ? 'पदयात्रा पड़ाव एवं दर्शनीय स्थल' : 'Trail Waypoints & Landmark Stops'}
          </h3>

          <div className="space-y-4">
            {selectedTrail.stops.map((stop, index) => {
              const isChecked = !!checkedStops[stop.id];

              return (
                <div
                  key={stop.id}
                  className={`relative flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                    isChecked
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-[#E8D9C0] dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-xs'
                  }`}
                >
                  {/* Step Number or Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStop(stop.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shrink-0 transition-all ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FAF6EF] dark:bg-slate-800 text-[#172554] dark:text-white border border-[#E8D9C0] dark:border-slate-700'
                    }`}
                    title={isChecked ? 'Mark unvisited' : 'Mark visited'}
                  >
                    {isChecked ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </button>

                  {/* Stop Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isChecked
                              ? 'line-through text-slate-500'
                              : 'text-[#172554] dark:text-white'
                          }`}
                        >
                          {isHindi && stop.hindiName ? stop.hindiName : stop.name}
                        </h4>
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                          {stop.recommendedTime}
                        </span>
                      </div>

                      {stop.placeId && (
                        <Link
                          href={`/place/${stop.placeId}`}
                          className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
                        >
                          {isHindi ? 'विवरण' : 'Details'}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isHindi && stop.hindiDescription ? stop.hindiDescription : stop.description}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-[#F59E0B]" />
                      <span>{stop.significance}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
