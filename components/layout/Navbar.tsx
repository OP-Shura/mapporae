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
  Footprints
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
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Location */}
        <div className="flex items-center gap-3">
          <Logo size="md" />

          {/* Active Varanasi Location Pill */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-[#FAF6EF] dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-[#172554] dark:text-slate-200 shadow-xs hover:border-[#0E7490] hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />
              <span className="max-w-[140px] truncate">{locationName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Location Selector Dropdown */}
            {isLocationDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-[#E8D9C0] dark:border-slate-700 bg-[#FAF9F6] dark:bg-slate-900 p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8D9C0] dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('nav.reference_spot')}
                  </span>
                  <button
                    onClick={() => {
                      requestLocation();
                      setIsLocationDropdownOpen(false);
                    }}
                    disabled={isLocating}
                    className="flex items-center gap-1 text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    GPS
                  </button>
                </div>

                <div className="mt-2 space-y-1">
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
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-[#E0F2FE] dark:bg-slate-800 font-semibold text-[#0E7490] dark:text-[#38BDF8]'
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
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

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E0F2FE] dark:bg-slate-800 text-[#0E7490] dark:text-[#38BDF8] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-[#FAF6EF] dark:hover:bg-slate-800/60 hover:text-[#172554] dark:hover:text-white'
                }`}
              >
                {link.label}
                {link.badge !== undefined && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-[11px] font-bold text-white shadow-xs">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Toggle */}
          <LanguageToggle variant="compact" />

          {/* Dark Mode Theme Toggle */}
          <ThemeToggle variant="compact" />

          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-full border border-[#0E7490]/30 dark:border-cyan-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8] hover:bg-[#E0F2FE]/50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('nav.search')}</span>
          </Link>

          <Link
            href="/services"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all hover:scale-[1.02]"
            title={t('emergency.title')}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav.emergency')}</span>
          </Link>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
