'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  variant?: 'button' | 'compact';
}

export function LanguageToggle({ className = '', variant = 'button' }: LanguageToggleProps) {
  const { language, toggleLanguage, isHindi } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`flex h-8 items-center gap-1 rounded-full px-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${className}`}
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
      className={`flex items-center gap-1.5 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-[#FAF6EF] dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-[#172554] dark:text-slate-200 shadow-xs hover:border-[#0E7490] hover:bg-white dark:hover:bg-slate-800 transition-all ${className}`}
      aria-label="Toggle language between English and Hindi"
      title="Switch Language: English / हिन्दी"
    >
      <Globe className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />
      <span className="font-mono">{language === 'en' ? 'EN | हिन्दी' : 'हिन्दी | EN'}</span>
    </button>
  );
}
