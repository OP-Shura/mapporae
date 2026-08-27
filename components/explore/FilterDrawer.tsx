'use client';

import React from 'react';
import { PlaceCategory } from '@/lib/types';
import { CATEGORIES_DATA } from '@/lib/data/categories';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface FilterDrawerProps {
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  radiusKm: number;
  onChangeRadius: (km: number) => void;
  openNowOnly: boolean;
  onToggleOpenNow: (open: boolean) => void;
  sortBy: 'distance' | 'rating' | 'popularity' | 'name';
  onChangeSortBy: (sort: 'distance' | 'rating' | 'popularity' | 'name') => void;
  totalResultsCount: number;
  onReset: () => void;
}

export function FilterDrawer({
  selectedCategory,
  onSelectCategory,
  radiusKm,
  onChangeRadius,
  openNowOnly,
  onToggleOpenNow,
  sortBy,
  onChangeSortBy,
  totalResultsCount,
  onReset,
}: FilterDrawerProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E8D9C0] bg-[#FAF6EF]/90 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8D9C0] pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0E7490]" />
          <h3 className="text-sm font-bold text-[#172554]">Filters & Radius</h3>
          <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-xs font-bold text-[#0E7490]">
            {totalResultsCount} found
          </span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#0E7490] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Pills Selector */}
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Categories ({CATEGORIES_DATA.length})
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#172554] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-[#E8D9C0] hover:border-[#0E7490]'
            }`}
          >
            All Places
          </button>

          {CATEGORIES_DATA.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#0E7490] text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 border border-[#E8D9C0] hover:border-[#0E7490]'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
          <span className="uppercase tracking-wider">Distance Radius</span>
          <span className="text-[#0E7490] font-black">{radiusKm} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={radiusKm}
          onChange={e => onChangeRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0E7490]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1 km (Ghats)</span>
          <span>7 km (City)</span>
          <span>15 km (Sarnath/Airport)</span>
        </div>
      </div>

      {/* Toggles & Sort Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#E8D9C0] pt-3">
        {/* Open Now Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8D9C0] cursor-pointer hover:border-[#0E7490] transition-colors">
          <span className="text-xs font-semibold text-[#172554]">Open Now Only</span>
          <input
            type="checkbox"
            checked={openNowOnly}
            onChange={e => onToggleOpenNow(e.target.checked)}
            className="w-4 h-4 rounded text-[#0E7490] accent-[#0E7490] cursor-pointer"
          />
        </label>

        {/* Sort by Dropdown */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8D9C0]">
          <span className="text-xs font-semibold text-slate-500 pl-1">Sort:</span>
          <select
            value={sortBy}
            onChange={e => onChangeSortBy(e.target.value as 'distance' | 'rating' | 'popularity' | 'name')}
            className="text-xs font-bold text-[#172554] bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            <option value="distance">Nearest First</option>
            <option value="rating">Highest Rated</option>
            <option value="popularity">Most Popular</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
