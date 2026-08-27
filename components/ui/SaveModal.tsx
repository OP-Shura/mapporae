'use client';

import React, { useState } from 'react';
import { Place } from '@/lib/types';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { 
  X, 
  Bookmark, 
  Plus, 
  Check
} from 'lucide-react';

interface SaveModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SaveModal({ place, isOpen, onClose }: SaveModalProps) {
  const { lists, isPlaceSaved, savePlace, removeSavedPlace, createList } = useSavedPlaces();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !place) return null;

  const handleToggleList = async (listId: string) => {
    const isSaved = isPlaceSaved(place.id, listId);
    if (isSaved) {
      await removeSavedPlace(place.id, listId);
    } else {
      await savePlace(place.id, listId, notes.trim() || undefined);
    }
  };

  const handleCreateListAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newId = await createList(newListName.trim());
      await savePlace(place.id, newId, notes.trim() || undefined);
      setNewListName('');
      setIsCreatingNew(false);
    } catch {
      // Handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-[#E8D9C0] bg-[#FAF9F6] p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6EF] text-[#0E7490] border border-[#E8D9C0]">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">Save to Itinerary</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{place.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notes input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Personal Note (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Try morning lassi or visit at sunrise"
            className="w-full rounded-xl border border-[#E8D9C0] bg-white px-3 py-2 text-xs text-[#172554] focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
          />
        </div>

        {/* Existing Lists Checklist */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Select Lists
          </label>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {lists.map(list => {
              const saved = isPlaceSaved(place.id, list.id);

              return (
                <button
                  key={list.id}
                  onClick={() => handleToggleList(list.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                    saved
                      ? 'border-[#0E7490] bg-[#E0F2FE] text-[#0E7490]'
                      : 'border-[#E8D9C0] bg-white text-slate-700 hover:border-[#0E7490]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{list.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {list.description}
                    </span>
                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-lg border ${
                      saved
                        ? 'border-[#0E7490] bg-[#0E7490] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {saved && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Create List */}
        {isCreatingNew ? (
          <form onSubmit={handleCreateListAndSave} className="flex gap-1.5 pt-2 border-t border-[#E8D9C0]">
            <input
              type="text"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="List name (e.g. Day 1 Sunrise)"
              className="flex-1 rounded-xl border border-[#E8D9C0] bg-white px-3 py-1.5 text-xs text-[#172554] focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="rounded-xl bg-[#0E7490] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="rounded-xl px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0E7490] hover:underline pt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create another custom list</span>
          </button>
        )}

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#172554] py-2.5 text-xs font-semibold text-white hover:bg-[#1E3A8A] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
