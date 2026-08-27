'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  variant?: 'button' | 'compact';
}

export function LanguageToggle({ className = '', variant = 'compact' }: LanguageToggleProps) {
  const { language, toggleLanguage, isHindi } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`flex h-9 items-center gap-1.5 rounded-full border border-[#E8D9C0] dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs ${className}`}
        aria-label="Toggle language between English and Hindi"
        title="Toggle language (English / हिन्दी)"
      >
        <Globe className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />
        <span>{isHindi ? 'हि' : 'EN'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`flex h-9 items-center gap-1.5 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all ${className}`}
      aria-label="Toggle language between English and Hindi"
      title="Switch Language: English / हिन्दी"
    >
      <Globe className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />
      <span className="font-mono">{language === 'en' ? 'EN | हिन्दी' : 'हिन्दी | EN'}</span>
    </button>
  );
}
