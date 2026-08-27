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
          className="flex h-9 items-center gap-2 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-1.5 pr-3 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-[#FAF6EF] dark:hover:bg-slate-700 transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172554] dark:bg-[#0E7490] text-[10px] font-bold text-white shadow-2xs">
            {initials}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate font-medium">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-2xl z-50 animate-spring-pop space-y-2 backdrop-blur-xl">
            {/* User Info Header */}
            <div className="pb-2.5 border-b border-[#E8D9C0]/80 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.displayName || 'Varanasi Explorer'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                <Cloud className={`w-3 h-3 ${isCloudSyncing ? 'animate-bounce' : ''}`} />
                <span>Cloud Sync Active</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              <Link
                href="/saved"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#E0F2FE] dark:hover:bg-slate-800 hover:text-[#0E7490] dark:hover:text-[#38BDF8] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[#F59E0B]" />
                <span>My Saved Places</span>
              </Link>
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-[#E8D9C0]/80 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
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
        className="flex h-9 items-center gap-1.5 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-3.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-[#0E7490] dark:hover:border-[#38BDF8] hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs"
        title="Sign in to sync your saved places across devices"
      >
        <User className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8]" />
        <span>Sign In</span>
      </button>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
}
