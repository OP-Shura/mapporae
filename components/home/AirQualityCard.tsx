'use client';

import React, { useEffect, useState } from 'react';
import { AirQualityData } from '@/lib/types';
import { fetchCurrentAirQuality, getFallbackAirQuality } from '@/lib/api/air-quality';
import { Wind, Activity, CheckCircle, AlertTriangle, AlertOctagon, Info, Sparkles } from 'lucide-react';

export function AirQualityCard({ initialData }: { initialData?: AirQualityData }) {
  const [aqiData, setAqiData] = useState<AirQualityData>(initialData || getFallbackAirQuality());

  useEffect(() => {
    if (initialData) return;

    let isMounted = true;
    fetchCurrentAirQuality().then(data => {
      if (isMounted) setAqiData(data);
    }).catch(() => {
      if (isMounted) setAqiData(getFallbackAirQuality());
    });

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'Moderate':
        return <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />;
      case 'Poor':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />;
      default:
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
    }
  };

  // Dynamic ambient glow depending on AQI condition
  const getAmbientGlow = (status: string) => {
    switch (status) {
      case 'Good':
        return 'from-emerald-400/20 to-teal-300/10 dark:from-emerald-600/20';
      case 'Moderate':
        return 'from-amber-400/25 to-yellow-300/10 dark:from-amber-600/20';
      case 'Poor':
        return 'from-orange-500/25 to-amber-400/10 dark:from-orange-600/20';
      default:
        return 'from-rose-500/25 to-red-400/10 dark:from-rose-600/20';
    }
  };

  return (
    <div className="glass-card glass-card-interactive relative overflow-hidden rounded-3xl p-5.5 sm:p-6 transition-all duration-300">
      {/* Ambient AQI Status Glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${getAmbientGlow(
          aqiData.status
        )} blur-3xl animate-pulse-subtle`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0E7490]/10 dark:bg-[#38BDF8]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
              <Sparkles className="w-3 h-3" /> Live Air Quality
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">• Central Kashi</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2.5">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-[#172554] dark:text-white">
              {aqiData.aqi}
            </h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AQI
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold border shadow-2xs backdrop-blur-md ${aqiData.badgeColor}`}
            >
              {getStatusIcon(aqiData.status)}
              <span>{aqiData.status}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 border border-[#E8D9C0] dark:border-slate-700 shadow-xs backdrop-blur-md transition-transform hover:scale-105">
          <Wind className="w-4 h-4 text-[#0E7490] dark:text-[#38BDF8] animate-float-slow" />
          <span>PM2.5: {aqiData.pm25} µg/m³</span>
        </div>
      </div>

      {/* Interactive Health Recommendation Advisory */}
      <div className="relative z-10 mt-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 p-3.5 border border-[#E8D9C0]/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed backdrop-blur-md shadow-2xs">
        <div className="flex items-start gap-2">
          <div className="rounded-lg bg-[#E0F2FE] dark:bg-slate-700 p-1 text-[#0E7490] dark:text-[#38BDF8] shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <p className="font-medium">{aqiData.healthRecommendation}</p>
        </div>
      </div>
    </div>
  );
}
