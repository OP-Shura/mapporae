'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { 
  User, 
  LogOut, 
  Cloud, 
  Bookmark, 
  ChevronDown
} from 'lucide-react';

export function UserMenu() {
  const { user, signOut, isCloudSyncing } = useSavedPlaces();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  // If user is signed in
  if (user) {
    const initials = user.displayName
      ? user.displayName.slice(0, 2).toUpperCase()
      : user.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'U';

    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 rounded-full border border-[#E8D9C0] bg-white p-1 pl-1.5 pr-2.5 text-xs font-semibold text-[#172554] shadow-xs hover:border-[#0E7490] hover:bg-[#FAF6EF] transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172554] text-[10px] font-bold text-white">
            {initials}
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate font-medium">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[#E8D9C0] bg-[#FAF9F6] p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
            {/* User Info Header */}
            <div className="pb-2 border-b border-[#E8D9C0]">
              <p className="text-xs font-bold text-[#172554] truncate">
                {user.displayName || 'Varanasi Explorer'}
              </p>
              <p className="text-[11px] text-slate-500 truncate font-mono">
                {user.email}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Cloud className={`w-3 h-3 ${isCloudSyncing ? 'animate-bounce' : ''}`} />
                <span>Cloud Sync Active</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              <Link
                href="/saved"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#E0F2FE] hover:text-[#0E7490] transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>My Saved Places</span>
              </Link>
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-[#E8D9C0]">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If user is anonymous / not signed in
  return (
    <>
      <button
        type="button"
        onClick={() => setIsAuthDialogOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-[#E8D9C0] bg-[#FAF6EF] px-3 py-1.5 text-xs font-semibold text-[#172554] hover:border-[#0E7490] hover:bg-white transition-all shadow-xs"
        title="Sign in to sync your saved places across devices"
      >
        <User className="w-3.5 h-3.5 text-[#0E7490]" />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
}
