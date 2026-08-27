'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 sm:bottom-8 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-2xl glass-panel text-[#0E7490] dark:text-[#38BDF8] border border-[#E8D9C0] dark:border-slate-700 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-115 hover:bg-white dark:hover:bg-slate-800 active:scale-95 animate-spring-pop"
      title="Scroll back to top"
      aria-label="Scroll back to top"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
