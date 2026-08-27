'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { VARANASI_PLACES_DATA } from '@/lib/data/places';
import { Place } from '@/lib/types';
import { DistanceBadge, OpenBadge } from '@/components/ui/Badge';
import { useLocation } from '@/lib/context/LocationContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { 
  Bookmark, 
  Trash2, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  FolderPlus,
  Calendar,
  Utensils,
  Shield,
  Star,
  Cloud,
  CloudUpload,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HardDrive,
  Cpu
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Utensils,
  Calendar,
  Shield,
  Bookmark,
  FolderPlus,
};

interface SavedPlaceEntry {
  place: Place;
  notes?: string;
  savedAt: string;
}

export function ListManager() {
  const { 
    user,
    lists, 
    savedItems, 
    activeListId, 
    setActiveListId, 
    removeSavedPlace, 
    createList, 
    deleteList,
    isCloudSyncing,
    isSupabaseAvailable,
    connectionStatus,
    connectionMessage,
    hasLocalDataToImport,
    importLocalDataToCloud,
    syncError,
    clearSyncError
  } = useSavedPlaces();
  
  const { getDistanceTo } = useLocation();

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [showDevDetails, setShowDevDetails] = useState(false);

  const activeList = lists.find(l => l.id === activeListId) || lists[0] || {
    id: 'must-visit',
    name: 'Must Visit',
    description: 'Iconic heritage landmarks, ancient temples, and main ghats of Kashi.',
    iconName: 'Sparkles',
    isDefault: true,
    createdAt: new Date().toISOString(),
  };

  // Get places in the current active list
  const activeSavedEntries = savedItems.filter(item => item.listId === activeList.id);
  const savedPlacesInList: SavedPlaceEntry[] = [];
  for (const entry of activeSavedEntries) {
    const place = VARANASI_PLACES_DATA.find(p => p.id === entry.placeId);
    if (place) {
      savedPlacesInList.push({
        place,
        notes: entry.notes,
        savedAt: entry.savedAt,
      });
    }
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newId = await createList(newListName.trim(), newListDesc.trim());
      setActiveListId(newId);
      setNewListName('');
      setNewListDesc('');
      setIsCreatingList(false);
    } catch {
      // Handled in context
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportFeedback(null);
    try {
      const result = await importLocalDataToCloud();
      if (result.success) {
        setImportFeedback(`Successfully imported ${result.count} places to your cloud account!`);
      } else {
        setImportFeedback('Import encountered an error. Please try again.');
      }
    } catch {
      setImportFeedback('Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Connection & Session Status Banner */}
      {connectionStatus === 'connected' && user ? (
        // Connected & Signed in
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172554] text-white font-bold text-sm shadow-xs">
              {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#172554]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-300">
                  <Cloud className={`w-3 h-3 ${isCloudSyncing ? 'animate-bounce text-emerald-600' : 'text-emerald-600'}`} />
                  {connectionMessage}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingList(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#0E7490] px-4 py-2 text-xs font-semibold text-white hover:bg-[#155E75] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Custom List</span>
          </button>
        </div>
      ) : connectionStatus === 'unavailable' ? (
        // Configured but Unreachable/Invalid
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-300 bg-amber-50 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-950">
                  Cloud Sync Alert
                </span>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  Offline Fallback
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed max-w-lg">
                {connectionMessage}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingList(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0E7490] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#155E75] transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New List</span>
          </button>
        </div>
      ) : (
        // Offline / Unconfigured or Anonymous Ready Mode
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-[#E8D9C0] bg-gradient-to-r from-[#FAF6EF] via-[#FFFDF9] to-[#FAF6EF] p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF6EF] text-[#0E7490] border border-[#E8D9C0] shrink-0">
              <HardDrive className="w-5 h-5 text-[#0E7490]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#172554]">
                  {connectionMessage}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  Local Mode
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-lg">
                {isSupabaseAvailable
                  ? 'Sign in with your email to sync your saved places and itineraries across your phone and laptop.'
                  : 'All your places, notes, and custom lists are stored privately in your browser storage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isSupabaseAvailable && (
              <button
                type="button"
                onClick={() => setIsAuthDialogOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A8A] transition-colors shadow-xs shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Sign in to sync</span>
              </button>
            )}

            <button
              onClick={() => setIsCreatingList(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0E7490] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#155E75] transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New List</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. One-Time Local Data Import Action Banner */}
      {user && hasLocalDataToImport && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-950 shadow-xs">
          <div className="flex items-start gap-2.5">
            <CloudUpload className="w-5 h-5 text-[#0E7490] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#172554]">
                Import Local Saved Places
              </h4>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                You have places saved in this browser from before signing in. Would you like to import them to your cloud account?
              </p>
              {importFeedback && (
                <p className="mt-1.5 font-bold text-emerald-700">{importFeedback}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center gap-1.5 rounded-xl bg-[#0E7490] px-4 py-2 text-xs font-bold text-white hover:bg-[#155E75] transition-colors shadow-xs shrink-0 disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Import to Cloud</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. Sync Error Alert */}
      {syncError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{syncError}</span>
          </div>
          <button
            onClick={clearSyncError}
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Development-only Test Support Status Indicator */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-700 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0E7490]" />
            <span className="font-bold text-[#172554]">Integration & Storage Status</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDevDetails(!showDevDetails)}
            className="text-[11px] text-[#0E7490] font-semibold hover:underline"
          >
            {showDevDetails ? 'Hide Status' : 'Show Status'}
          </button>
        </div>

        {showDevDetails && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200 text-[11px]">
            <div className="rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Supabase Configured:</span>
              <span className={`font-bold ${isSupabaseAvailable ? 'text-emerald-700' : 'text-slate-700'}`}>
                {isSupabaseAvailable ? 'Yes' : 'No (Offline Mode)'}
              </span>
            </div>

            <div className="rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Auth Session:</span>
              <span className={`font-bold ${user ? 'text-emerald-700' : 'text-slate-700'}`}>
                {user ? `Signed In` : 'Anonymous'}
              </span>
            </div>

            <div className="rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Storage Mode:</span>
              <span className={`font-bold ${user ? 'text-[#0E7490]' : 'text-[#D97706]'}`}>
                {user ? 'Cloud (PostgreSQL)' : 'Local (Browser)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. List Creation Form Modal / Card */}
      {isCreatingList && (
        <form
          onSubmit={handleCreateList}
          className="rounded-2xl border border-[#0E7490] bg-white p-5 shadow-lg space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172554]">Create New Itinerary / Place List</h3>
            <button
              type="button"
              onClick={() => setIsCreatingList(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="List Title (e.g. Ganga Sunrise Itinerary)"
              className="w-full rounded-xl border border-[#E8D9C0] px-3 py-2 text-xs text-[#172554] focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
              autoFocus
            />
            <input
              type="text"
              value={newListDesc}
              onChange={e => setNewListDesc(e.target.value)}
              placeholder="Short Description (e.g. Places to visit between 5 AM and 9 AM)"
              className="w-full rounded-xl border border-[#E8D9C0] px-3 py-2 text-xs text-[#172554] focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingList(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="rounded-lg bg-[#0E7490] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#155E75] disabled:opacity-50"
            >
              Create List
            </button>
          </div>
        </form>
      )}

      {/* 6. List Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {lists.map(list => {
          const isSelected = list.id === activeList.id;
          const count = savedItems.filter(i => i.listId === list.id).length;
          const IconComp = ICON_MAP[list.iconName] || Bookmark;

          return (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#172554] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-[#E8D9C0] hover:border-[#0E7490]'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F59E0B]' : 'text-[#0E7490]'}`} />
              <span>{list.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 7. Active List Header */}
      <div className="flex items-center justify-between border-b border-[#E8D9C0] pb-2">
        <div>
          <h2 className="text-lg font-bold text-[#172554]">{activeList.name}</h2>
          <p className="text-xs text-slate-500">{activeList.description}</p>
        </div>

        {!activeList.isDefault && (
          <button
            onClick={() => {
              if (confirm(`Delete list "${activeList.name}"?`)) {
                deleteList(activeList.id);
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete list</span>
          </button>
        )}
      </div>

      {/* 8. Saved Places Grid / Empty State */}
      {savedPlacesInList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E8D9C0] bg-[#FAF6EF]/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0E7490] mb-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#172554]">No places saved in this list yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            Explore Varanasi ghats, mandirs, chaat spots, and save your favorites to build your personalized plan.
          </p>
          <Link
            href="/explore"
            className="mt-5 flex items-center gap-1.5 rounded-xl bg-[#0E7490] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#155E75] transition-all hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Places to Save</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPlacesInList.map(({ place, notes, savedAt }) => {
            const distance = getDistanceTo(place.coordinates);

            return (
              <div
                key={place.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E8D9C0] bg-white p-4 shadow-xs transition-all hover:border-[#0E7490] hover:shadow-md"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E7490]">
                          {place.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      <Link href={`/place/${place.id}`}>
                        <h4 className="font-bold text-sm text-[#172554] group-hover:text-[#0E7490] transition-colors leading-snug">
                          {place.name}
                        </h4>
                      </Link>

                      {place.hindiName && (
                        <p className="text-[11px] text-slate-500">{place.hindiName}</p>
                      )}

                      <div className="mt-1 flex items-center gap-2">
                        <DistanceBadge distanceKm={distance} />
                        <OpenBadge isOpen={place.openNow} />
                      </div>
                    </div>
                  </div>

                  {notes && (
                    <div className="mt-3 rounded-lg bg-[#FAF6EF] p-2 text-xs text-slate-600 border border-[#E8D9C0]">
                      <span className="font-semibold text-[#172554] mr-1">Note:</span>
                      <span>{notes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="text-[10px] text-slate-400">
                    Saved on {new Date(savedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeSavedPlace(place.id, activeList.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/place/${place.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#0E7490] hover:underline"
                    >
                      <span>Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Auth Dialog Modal */}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </div>
  );
}
