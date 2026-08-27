'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, X, Waves, Footprints, Anchor } from 'lucide-react';

interface GhatMilestone {
  name: string;
  hindiName: string;
  km: number;
  threshold: number; // 0 to 100%
  description: string;
  tag: string;
}

const GHAT_MILESTONES: GhatMilestone[] = [
  {
    name: 'Assi Ghat',
    hindiName: 'अस्सी घाट',
    km: 0.0,
    threshold: 0,
    description: 'Subah-e-Banaras sunrise yoga & music',
    tag: 'Southern Origin',
  },
  {
    name: 'Harishchandra Ghat',
    hindiName: 'हरिश्चंद्र घाट',
    km: 1.2,
    threshold: 20,
    description: 'Ancient royal heritage & eternal flame',
    tag: 'Ancient Heritage',
  },
  {
    name: 'Dashashwamedh Ghat',
    hindiName: 'दशाश्वमेध घाट',
    km: 2.8,
    threshold: 45,
    description: 'Heart of Kashi & Daily 6:30 PM Maha Aarti',
    tag: 'Main Ghat',
  },
  {
    name: 'Manikarnika Ghat',
    hindiName: 'मणिकर्णिका घाट',
    km: 3.6,
    threshold: 68,
    description: 'Sacred liberation shrine & Mukti Dham',
    tag: 'Sacred Shrine',
  },
  {
    name: 'Panchganga Ghat',
    hindiName: 'पंचगंगा घाट',
    km: 4.9,
    threshold: 85,
    description: 'Confluence of 5 sacred rivers & Alamgir',
    tag: 'Confluence',
  },
  {
    name: 'Rajghat',
    hindiName: 'राजघाट',
    km: 6.5,
    threshold: 98,
    description: 'Malviya Bridge & Northern Gateway',
    tag: 'Northern Terminal',
  },
];

export function ScrollGangaBoat() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGhat, setActiveGhat] = useState<GhatMilestone>(GHAT_MILESTONES[0]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 450);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
            setScrollProgress(currentProgress);

            // Find matching ghat
            for (let i = GHAT_MILESTONES.length - 1; i >= 0; i--) {
              if (currentProgress >= GHAT_MILESTONES[i].threshold) {
                setActiveGhat(GHAT_MILESTONES[i]);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* =================================================================== */}
      {/* 1. Desktop & Tablet Side River Journey Tracker                      */}
      {/* =================================================================== */}
      <aside
        aria-label="Ganga Boat River Progress"
        className="fixed right-3.5 top-28 z-30 hidden lg:flex flex-col items-center select-none"
      >
        {/* River Progress Track */}
        <div className="relative flex flex-col items-center">
          {/* River Stream Glass Tube */}
          <div className="relative h-64 w-3.5 rounded-full liquid-glass overflow-hidden border border-[#E8D9C0] dark:border-slate-700 shadow-inner">
            {/* Water Flow Shimmer */}
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#0E7490] via-[#0284C7] to-[#F59E0B] rounded-full transition-all duration-150 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
            {/* Animated Stream Particles */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-float-slow opacity-60" />
          </div>

          {/* Animated Traditional Wooden Boat along the Stream */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-200 ease-out z-20 cursor-pointer"
            style={{ top: `calc(${scrollProgress}% * 0.85)` }}
            onClick={() => setIsExpanded(!isExpanded)}
            title="Click to view Ganga Ghat Trail details"
          >
            <div className={`relative flex items-center justify-center ${isScrolling ? 'animate-boat-sway' : ''}`}>
              {/* Water Wake Ripples behind boat when scrolling */}
              {isScrolling && (
                <div className="absolute -top-1 h-8 w-8 rounded-full border border-cyan-400/60 dark:border-cyan-300/40 animate-water-wake pointer-events-none" />
              )}

              {/* Wooden Banaras Nauka SVG */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md transition-transform hover:scale-120"
              >
                {/* Hull (Rich Teak Wood) */}
                <path
                  d="M6 26C12 34 36 34 42 26C36 31 12 31 6 26Z"
                  fill="#854D0E"
                  stroke="#713F12"
                  strokeWidth="1.5"
                />
                {/* Traditional Deck Planks */}
                <path
                  d="M10 27C16 32 32 32 38 27"
                  stroke="#CA8A04"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                {/* Vintage Saffron/Marigold Canopy Roof */}
                <path
                  d="M16 23C16 16 32 16 32 23H16Z"
                  fill="#F59E0B"
                  stroke="#B45309"
                  strokeWidth="1.5"
                />
                {/* Canopy Pole */}
                <line x1="24" y1="16" x2="24" y2="12" stroke="#B45309" strokeWidth="1.5" />
                {/* Sacred Kashi Flag / Pataka */}
                <path d="M24 12L30 14L24 16V12Z" fill="#DC2626" />

                {/* Animated Left Wooden Oar */}
                <g className={isScrolling ? 'animate-oar-left' : ''}>
                  <line
                    x1="20"
                    y1="25"
                    x2="10"
                    y2="34"
                    stroke="#78350F"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <ellipse cx="9" cy="35" rx="2.5" ry="4" transform="rotate(-30 9 35)" fill="#92400E" />
                </g>

                {/* Animated Right Wooden Oar */}
                <g className={isScrolling ? 'animate-oar-right' : ''}>
                  <line
                    x1="28"
                    y1="25"
                    x2="38"
                    y2="34"
                    stroke="#78350F"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <ellipse cx="39" cy="35" rx="2.5" ry="4" transform="rotate(30 39 35)" fill="#92400E" />
                </g>
              </svg>

              {/* Live Distance Beacon */}
              <span className="absolute -right-8 top-1.5 flex h-4 items-center justify-center rounded-md bg-[#172554] dark:bg-[#0E7490] px-1 text-[9px] font-mono font-bold text-white shadow-xs">
                {activeGhat.km.toFixed(1)}k
              </span>
            </div>
          </div>
        </div>

        {/* Floating Active Ghat Landmark Badge */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex flex-col items-center rounded-2xl liquid-glass p-2.5 shadow-lg transition-all hover:scale-105 border border-[#E8D9C0] dark:border-slate-700"
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#0E7490] dark:text-[#38BDF8] uppercase tracking-wider">
            <Anchor className="w-3 h-3 text-[#F59E0B]" />
            <span>{activeGhat.name.split(' ')[0]}</span>
          </div>
          <span className="text-[11px] font-black text-[#172554] dark:text-white mt-0.5 max-w-[90px] truncate text-center">
            {activeGhat.hindiName}
          </span>
          <span className="mt-1 flex items-center gap-0.5 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
            {scrollProgress.toFixed(0)}% Kashi Trail
          </span>
        </button>
      </aside>

      {/* =================================================================== */}
      {/* 2. Expandable Ghat Trail Modal / Drawer                             */}
      {/* =================================================================== */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl liquid-glass-card p-6 shadow-2xl border border-[#E8D9C0] dark:border-slate-700 animate-spring-pop">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8D9C0]/80 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] dark:bg-cyan-950/80 text-[#0E7490] dark:text-[#38BDF8]">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#172554] dark:text-white">
                    Sacred Ganga Ghat Trail
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live scroll journey from Assi to Rajghat
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="rounded-full p-1 text-slate-400 hover:text-[#172554] dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Milestones List */}
            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {GHAT_MILESTONES.map(ghat => {
                const isPassed = scrollProgress >= ghat.threshold;
                const isCurrent = activeGhat.name === ghat.name;

                return (
                  <div
                    key={ghat.name}
                    className={`flex items-start gap-3 rounded-2xl p-3 transition-all ${
                      isCurrent
                        ? 'bg-[#E0F2FE] dark:bg-[#0E7490]/25 border border-[#0E7490] dark:border-[#38BDF8] shadow-xs'
                        : isPassed
                        ? 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80'
                        : 'opacity-60 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50'
                    }`}
                  >
                    <div className="flex flex-col items-center mt-0.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isCurrent
                            ? 'bg-[#0E7490] text-white shadow-sm'
                            : isPassed
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isCurrent ? '⛵' : '📍'}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {ghat.name}{' '}
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            ({ghat.hindiName})
                          </span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-[#0E7490] dark:text-[#38BDF8]">
                          {ghat.km} km
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        {ghat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="mt-5 flex items-center justify-between border-t border-[#E8D9C0]/80 dark:border-slate-700/80 pt-3">
              <Link
                href="/tours"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
              >
                <Footprints className="w-4 h-4" />
                <span>Explore Walking Trails & Boat Tariffs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. Mobile Bottom Floating Boat Capsule                              */}
      {/* =================================================================== */}
      <div className="lg:hidden fixed bottom-18 left-3 z-30 select-none">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-full liquid-glass px-3.5 py-1.5 shadow-lg border border-[#E8D9C0] dark:border-slate-700 transition-all active:scale-95"
        >
          <div className={`relative ${isScrolling ? 'animate-boat-sway' : ''}`}>
            <span className="text-sm">⛵</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-[#172554] dark:text-white block leading-none">
              {activeGhat.name.split(' ')[0]}
            </span>
            <span className="text-[9px] font-semibold text-[#0E7490] dark:text-[#38BDF8]">
              {scrollProgress.toFixed(0)}% Ganga Trail
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
