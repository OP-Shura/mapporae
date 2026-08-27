'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { useLocation } from '@/lib/context/LocationContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { 
  Compass, 
  Bookmark, 
  ShieldAlert, 
  MapPin, 
  Search, 
  ChevronDown, 
  LocateFixed, 
  Check, 
  PhoneCall,
  Footprints,
  Sparkles
} from 'lucide-react';

const emptySubscribe = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const { totalSavedCount } = useSavedPlaces();
  const { userLocation, locationName, requestLocation, isLocating, presets, setUserCoords } = useLocation();
  const { t } = useLanguage();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/explore', label: t('nav.explore'), icon: Compass },
    { href: '/tours', label: t('nav.tours'), icon: Footprints },
    { href: '/services', label: t('nav.services'), icon: ShieldAlert },
    { 
      href: '/saved', 
      label: t('nav.saved'), 
      icon: Bookmark,
      badge: isMounted && totalSavedCount > 0 ? totalSavedCount : undefined 
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8D9C0] dark:border-slate-800/80 bg-[#FAF9F6]/90 dark:bg-[#080D1A]/90 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* ================================================================= */}
        {/* 1. Left: Brand & Location Selector                                */}
        {/* ================================================================= */}
        <div className="flex items-center gap-3.5">
          <Logo size="md" />

          {/* Reference Location Pill */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex h-9 items-center gap-2 rounded-full border border-[#E8D9C0] dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E7490] dark:bg-[#38BDF8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E7490] dark:bg-[#38BDF8]" />
              </div>
              <MapPin className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8] shrink-0" />
              <span className="max-w-[125px] truncate font-medium text-slate-700 dark:text-slate-200">
                {locationName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Location Selector Dropdown */}
            {isLocationDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-2xl z-50 animate-spring-pop backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8D9C0]/80 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#0E7490] dark:text-[#38BDF8] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                    {t('nav.reference_spot')}
                  </span>
                  <button
                    onClick={() => {
                      requestLocation();
                      setIsLocationDropdownOpen(false);
                    }}
                    disabled={isLocating}
                    className="flex items-center gap-1 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>GPS</span>
                  </button>
                </div>

                <div className="mt-2 space-y-1 max-h-56 overflow-y-auto pr-1">
                  {presets.map(p => {
                    const isSelected =
                      Math.abs(userLocation.lat - p.coordinates.lat) < 0.001 &&
                      Math.abs(userLocation.lng - p.coordinates.lng) < 0.001;

                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          setUserCoords(p.coordinates, p.name);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-[#E0F2FE] dark:bg-cyan-950/80 font-bold text-[#0E7490] dark:text-[#38BDF8]'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. Center: Clean Minimal Navigation Tabs                          */}
        {/* ================================================================= */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0E7490] text-white shadow-xs dark:bg-[#38BDF8] dark:text-slate-950'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#0E7490] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black shadow-2xs ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-[#F59E0B] text-white'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ================================================================= */}
        {/* 3. Right: Unified Action Controls & Tools                         */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <Link
            href="/explore"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9C0] dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs"
            title="Search Places & Services"
            aria-label="Search Places & Services"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Language Toggle */}
          <LanguageToggle variant="compact" />

          {/* Theme Toggle */}
          <ThemeToggle variant="compact" />

          {/* Emergency 112 Help Button */}
          <Link
            href="/services"
            className="flex h-9 items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white px-3.5 text-xs font-bold shadow-xs hover:shadow-md transition-all hover:scale-103 active:scale-95"
            title={t('emergency.title')}
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">112 Help</span>
          </Link>

          {/* User Sign In / Profile Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
