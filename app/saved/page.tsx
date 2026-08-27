import React from 'react';
import { ListManager } from '@/components/saved/ListManager';
import { FolderHeart } from 'lucide-react';

export const metadata = {
  title: 'Saved Places & Custom Lists — Mapporae Varanasi',
  description: 'Manage your bookmarked ghats, temples, street food itineraries, and essentials in Varanasi.',
};

export default function SavedPlacesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0E7490]">
          <FolderHeart className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Personal Itineraries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554]">
          Saved Places & Curated Lists
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Organize your spiritual pilgrimages, evening aarti plans, street food crawls, and emergency essentials.
        </p>
      </div>

      {/* List Manager Component */}
      <ListManager />
    </div>
  );
}
