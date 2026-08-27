'use client';

import React from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'compact';
}

export function ThemeToggle({ className = '', variant = 'compact' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9C0] dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-amber-400 hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs ${className}`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className="h-4 w-4 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 animate-in spin-in-90 duration-200" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-14 items-center rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-1 shadow-xs transition-colors hover:border-[#0E7490] ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 shadow-xs ${
          isDark
            ? 'translate-x-5 bg-slate-700 text-amber-400'
            : 'translate-x-0 bg-white text-[#0E7490]'
        }`}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <span className="sr-only">Toggle dark mode</span>
    </button>
  );
}
