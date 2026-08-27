'use client';

import React, { useEffect, useState } from 'react';
import { WeatherData } from '@/lib/types';
import { fetchCurrentWeather, getFallbackWeather } from '@/lib/api/weather';
import { Sun, Cloud, CloudRain, Wind, Droplets, Sunrise, Sunset, RefreshCw, Sparkles } from 'lucide-react';

export function WeatherCard({ initialData }: { initialData?: WeatherData }) {
  const [weather, setWeather] = useState<WeatherData>(initialData || getFallbackWeather());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) return;

    let isMounted = true;
    fetchCurrentWeather().then(data => {
      if (isMounted) setWeather(data);
    }).catch(() => {
      if (isMounted) setWeather(getFallbackWeather());
    });

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  const loadWeather = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCurrentWeather();
      setWeather(data);
    } catch {
      setWeather(getFallbackWeather());
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) {
      return (
        <div className="relative">
          <Sun className="w-8 h-8 text-[#F59E0B] animate-spin-slow" />
          <span className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse-subtle" />
        </div>
      );
    }
    if (code >= 51 && code <= 67) {
      return (
        <div className="relative">
          <CloudRain className="w-8 h-8 text-[#0E7490] animate-bounce" />
          <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md" />
        </div>
      );
    }
    return (
      <div className="relative">
        <Cloud className="w-8 h-8 text-slate-500 animate-float-slow" />
      </div>
    );
  };

  return (
    <div className="liquid-glass-card relative overflow-hidden rounded-3xl p-5.5 sm:p-6 transition-all duration-300">
      {/* Soft Ambient Weather Backlight */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#E0F2FE]/70 dark:bg-cyan-900/30 blur-2xl animate-pulse-subtle" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[#FEF3C7]/60 dark:bg-amber-950/20 blur-2xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0E7490]/10 dark:bg-[#38BDF8]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
              <Sparkles className="w-3 h-3" /> Live Weather
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">• Kashi Ghats</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-[#172554] dark:text-white">
              {weather.temp}°C
            </h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Feels {weather.feelsLike}°C
            </span>
          </div>

          <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {weather.weatherText}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-2.5 border border-[#E8D9C0] dark:border-slate-700 shadow-xs backdrop-blur-md transition-transform hover:scale-110">
            {getWeatherIcon(weather.weatherCode)}
          </div>

          <button
            onClick={loadWeather}
            disabled={isLoading}
            className="text-[10px] font-bold text-slate-500 hover:text-[#0E7490] dark:text-slate-400 dark:hover:text-[#38BDF8] flex items-center gap-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-[#E8D9C0] dark:border-slate-700 px-2 py-0.5 shadow-2xs transition-all hover:scale-105"
            title="Refresh weather"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? 'animate-spin text-[#0E7490]' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Live'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Interactive Weather Metrics */}
      <div className="relative z-10 mt-5 grid grid-cols-4 gap-2 border-t border-[#E8D9C0]/80 dark:border-slate-700/80 pt-4 text-center">
        <div className="flex flex-col items-center rounded-xl bg-white/60 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-700/50 shadow-2xs transition-all hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
          <Droplets className="w-4 h-4 text-[#0E7490] dark:text-[#38BDF8] mb-1 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Humidity</span>
          <span className="text-xs font-black text-[#172554] dark:text-white mt-0.5">{weather.humidity}%</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-white/60 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-700/50 shadow-2xs transition-all hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
          <Wind className="w-4 h-4 text-slate-500 dark:text-slate-400 mb-1 animate-float-slow" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Wind</span>
          <span className="text-xs font-black text-[#172554] dark:text-white mt-0.5">{weather.windSpeed} km/h</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-white/60 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-700/50 shadow-2xs transition-all hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
          <Sunrise className="w-4 h-4 text-[#F59E0B] mb-1" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Sunrise</span>
          <span className="text-xs font-black text-[#172554] dark:text-white mt-0.5">{weather.sunrise}</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-white/60 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-700/50 shadow-2xs transition-all hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
          <Sunset className="w-4 h-4 text-rose-500 mb-1" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Sunset</span>
          <span className="text-xs font-black text-[#172554] dark:text-white mt-0.5">{weather.sunset}</span>
        </div>
      </div>
    </div>
  );
}
