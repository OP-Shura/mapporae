import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showTagline = false, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`group flex items-center gap-2.5 transition-transform hover:scale-[1.02] ${className}`}>
      {/* Folded Map / Pin "M" Logo Mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] via-[#0E7490] to-[#F59E0B] p-[1.5px] shadow-sm shadow-cyan-950/10`}>
        <div className={`flex items-center justify-center rounded-[10.5px] bg-[#FAF9F6] dark:bg-[#0B1120] ${iconSizes[size]} transition-colors group-hover:bg-[#FFFDF9] dark:group-hover:bg-[#131E32]`}>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 transform transition-transform duration-300 group-hover:rotate-1"
          >
            {/* Left Fold */}
            <path
              d="M6 8.5L13 5.5V23.5L6 26.5V8.5Z"
              fill="#0E7490"
              fillOpacity="0.95"
            />
            {/* Center Fold with 'M' Peak */}
            <path
              d="M13 5.5L19 9.5V27.5L13 23.5V5.5Z"
              fill="#F4E7D3"
              stroke="#0E7490"
              strokeWidth="0.75"
            />
            {/* Right Fold */}
            <path
              d="M19 9.5L26 6.5V24.5L19 27.5V9.5Z"
              fill="#172554"
            />
            {/* Marigold Sunrise Pin Accent */}
            <circle cx="16" cy="11" r="3.2" fill="#F59E0B" />
            <path d="M16 14.2L16 19" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-[#172554] dark:text-white ${textSizes[size]}`}>
            Mapporae
          </span>
          <span className="rounded-full bg-[#E0F2FE] dark:bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#0E7490] dark:text-cyan-300">
            Kashi
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Your city, made simple.
          </span>
        )}
      </div>
    </Link>
  );
}
