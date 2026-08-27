'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export function PWARegister() {
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });
  const { t } = useLanguage();

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => {
            reg.update();
          })
          .catch(() => {
            // Service worker registration optional in non-supported environments
          });
      });
    }

    // 2. Connectivity Monitoring
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/90 p-3.5 shadow-xl text-amber-900 dark:text-amber-200 text-xs">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-bold">{t('pwa.offline_title')}</p>
          <p className="text-[11px] opacity-90 leading-tight mt-0.5">
            {t('pwa.offline_desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
