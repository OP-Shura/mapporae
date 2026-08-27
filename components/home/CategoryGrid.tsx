import React from 'react';
import Link from 'next/link';
import { CATEGORIES_DATA } from '@/lib/data/categories';
import { 
  Waves, 
  Flame, 
  Utensils, 
  Coffee, 
  HeartPulse, 
  Pill, 
  Banknote, 
  Compass, 
  Trees, 
  BookOpen, 
  Building, 
  DoorOpen, 
  SquareParking,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Waves,
  Flame,
  Utensils,
  Coffee,
  HeartPulse,
  Pill,
  Banknote,
  Compass,
  Trees,
  BookOpen,
  Building,
  DoorOpen,
  SquareParking,
};

export function CategoryGrid() {
  // Show top 8 primary categories on the home page
  const primaryCategories = CATEGORIES_DATA.slice(0, 8);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Curated Directory</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#172554] dark:text-white">
            Quick Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse Varanasi essentials, heritage spots, temples, and street food
          </p>
        </div>

        <Link
          href="/explore"
          className="group inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
        >
          <span>View all 13 categories</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {primaryCategories.map(cat => {
          const IconComponent = ICON_MAP[cat.iconName] || Compass;

          return (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="glass-card glass-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4.5 transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Subtle dynamic corner glow on hover matching category */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60"
                style={{ backgroundColor: cat.color }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-115 group-hover:shadow-md"
                  style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                >
                  <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <span className="rounded-full bg-[#FAF6EF]/90 dark:bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 border border-[#E8D9C0] dark:border-slate-700 shadow-2xs backdrop-blur-xs">
                  {cat.count} places
                </span>
              </div>

              <div className="relative z-10 mt-3.5">
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-sm font-bold text-[#172554] dark:text-white group-hover:text-[#0E7490] dark:group-hover:text-[#38BDF8] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                    {cat.hindiName}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
