'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/lib/context/LocationContext';
import { filterLocalPresetLocations, searchVaranasiLocations, GeocodingResult } from '@/lib/api/geocoding';
import { Search, MapPin, LocateFixed, ArrowRight, Loader2, X, Sparkles } from 'lucide-react';

export function HeroSearch() {
  const router = useRouter();
  const { requestLocation, isLocating, presets, setUserCoords, isOutsideCoverage } = useLocation();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derived locally without synchronous setState in effect
  const presetSuggestions = useMemo(() => {
    return filterLocalPresetLocations(query);
  }, [query]);

  const showDropdown = isFocused && query.trim().length >= 2 && presetSuggestions.length > 0;

  // Click outside to dismiss suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    const submittedQuery = query.trim();

    if (!submittedQuery) {
      router.push('/explore');
      return;
    }

    const localMatch = filterLocalPresetLocations(submittedQuery)[0];
    if (localMatch) {
      handleSelectPreset(localMatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const geocodeResults = await searchVaranasiLocations(submittedQuery);
      const matchedLocation = geocodeResults[0];

      if (matchedLocation) {
        setUserCoords(matchedLocation.coordinates, matchedLocation.name);
        router.push(`/explore?location=${encodeURIComponent(matchedLocation.name)}`);
        return;
      }

      router.push(`/explore?q=${encodeURIComponent(submittedQuery)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (item: GeocodingResult) => {
    setUserCoords(item.coordinates, item.name);
    setQuery(item.name);
    setIsFocused(false);
    router.push(`/explore?q=${encodeURIComponent(item.name)}`);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl liquid-glass border border-[#E8D9C0] dark:border-slate-800 p-6 sm:p-12 shadow-xl backdrop-blur-2xl vintage-arch-motif">
      {/* Royal Sandstone & Ganga Light Ambient Glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#0E7490]/25 via-cyan-400/15 to-transparent dark:from-[#38BDF8]/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-gradient-to-tr from-[#D97706]/25 via-amber-300/15 to-transparent dark:from-[#FBBF24]/20 blur-3xl animate-float-reverse" />

      {/* Decorative Vintage Arch Silhouette in corner */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#F59E0B]/10 to-transparent blur-xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Civic Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 text-xs font-bold text-[#172554] dark:text-slate-200 shadow-sm mb-5 transition-transform hover:scale-105">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]" />
          </span>
          <span className="text-[#0E7490] dark:text-[#38BDF8]">Your city, made simple</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>Varanasi, UP</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        </div>

        {/* Hero Headlines with Neo-Heritage Vintage + Modern Styling */}
        <h1 className="text-3xl font-black tracking-tight text-[#172554] dark:text-white sm:text-5xl sm:leading-tight">
          Discover Varanasi, <span className="shimmer-text">simply.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Ancient ghats, sacred temple corridors, authentic street food, emergency desks, and live Ganga Aarti rituals.
        </p>

        {/* Outside Coverage Notification Notice */}
        {isOutsideCoverage && (
          <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-amber-300 bg-amber-50/90 dark:bg-amber-950/40 dark:border-amber-700 p-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-xs backdrop-blur-md">
            📍 <strong>Notice:</strong> Mapporae currently covers Varanasi. Showing places relative to Varanasi city centre.
          </div>
        )}

        {/* Search & Location Box with Liquid Glass & Glow Halo */}
        <div className="mt-8 relative" ref={dropdownRef}>
          <form
            onSubmit={handleSearchSubmit}
            className={`flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white/85 dark:bg-slate-900/85 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-300 border-2 ${
              isFocused
                ? 'border-[#0E7490] dark:border-[#38BDF8] ring-4 ring-[#0E7490]/15 dark:ring-[#38BDF8]/20 scale-[1.01]'
                : 'border-[#E8D9C0] dark:border-slate-700 hover:border-[#0E7490]/60'
            }`}
          >
            <div className="flex flex-1 items-center gap-2.5 px-3 w-full">
              <Search className={`w-5 h-5 transition-colors shrink-0 ${isFocused ? 'text-[#0E7490] dark:text-[#38BDF8]' : 'text-slate-400'}`} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search ghats, temples, chaat, pharmacies, ATMs..."
                className="w-full text-sm font-medium text-[#172554] dark:text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#E8D9C0] dark:border-slate-700 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="liquid-glass-pill flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] shrink-0"
                title="Use your device GPS coordinates"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Use Location'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#172554] dark:bg-[#0E7490] px-5 py-2 text-xs font-bold text-white hover:bg-[#1E3A8A] dark:hover:bg-[#155E75] transition-all hover:scale-103 shadow-md shrink-0"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{isSubmitting ? 'Searching...' : 'Explore'}</span>
              </button>
            </div>
          </form>

          {/* Local Preset Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2.5 rounded-3xl liquid-glass-card p-2.5 shadow-2xl z-50 text-left animate-spring-pop">
              <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Varanasi Landmarks
              </div>
              <div className="space-y-1">
                {presetSuggestions.map((item, idx) => (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectPreset(item)}
                    className="w-full flex items-start gap-2.5 rounded-2xl p-2.5 text-xs hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all text-left group"
                  >
                    <div className="rounded-xl bg-[#E0F2FE] dark:bg-slate-800 p-2 text-[#0E7490] dark:text-[#38BDF8] group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#172554] dark:text-white group-hover:text-[#0E7490] dark:group-hover:text-[#38BDF8] transition-colors">{item.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.displayName}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Popular Quick Presets as Liquid Glass Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold mr-1">Popular:</span>
          {presets.slice(0, 4).map(p => (
            <button
              key={p.name}
              onClick={() => {
                setUserCoords(p.coordinates, p.name);
                router.push(`/explore?q=${encodeURIComponent(p.name)}`);
              }}
              className="liquid-glass-pill rounded-full px-3.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#0E7490] dark:hover:text-[#38BDF8] shadow-xs"
            >
              📍 {p.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
