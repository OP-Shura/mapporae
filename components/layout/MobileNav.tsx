'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShieldAlert, Bookmark, Footprints } from 'lucide-react';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { useLanguage } from '@/lib/context/LanguageContext';

const emptySubscribe = () => () => {};

export function MobileNav() {
  const pathname = usePathname();
  const { totalSavedCount } = useSavedPlaces();
  const { t } = useLanguage();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#E8D9C0] dark:border-slate-800 bg-[#FAF9F6]/95 dark:bg-[#0B1120]/95 backdrop-blur-md px-2 py-1.5 shadow-lg transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0E7490] dark:text-[#38BDF8] font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#172554] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#0E7490] dark:text-[#38BDF8]' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-[#0E7490] dark:bg-[#38BDF8]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
