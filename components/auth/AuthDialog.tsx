'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { sanitizeEmail } from '@/lib/security/sanitize';
import { 
  X, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function AuthDialog({ isOpen, onClose, defaultEmail = '' }: AuthDialogProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    const validatedEmail = sanitizeEmail(email);
    if (!validatedEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      setErrorMessage('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable cloud sync.');
      return;
    }

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/saved`
        : '/auth/callback';

      const { error } = await supabase.auth.signInWithOtp({
        email: validatedEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSent(true);
      }
    } catch {
      setErrorMessage('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setEmail('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-[#E8D9C0] bg-[#FAF9F6] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0E7490] border border-cyan-200">
              <Sparkles className="w-5 h-5 text-[#0E7490]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                {isSent ? 'Check Your Inbox' : 'Sign in to Mapporae'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSent ? 'Magic link on its way' : 'Sync your saved places across devices'}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Notice if env vars missing */}
        {!isSupabaseConfigured && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>Offline / Local Storage Mode</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Supabase environment keys are not configured yet. Mapporae will continue saving all your lists and bookmarks locally in your browser with zero interruptions.
            </p>
          </div>
        )}

        {/* Success Confirmation State */}
        {isSent ? (
          <div className="space-y-4 py-2 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#172554]">
                Magic link sent to:
              </p>
              <p className="text-xs font-mono font-bold text-[#0E7490] bg-[#FAF6EF] py-1 px-3 rounded-lg border border-[#E8D9C0] inline-block">
                {email}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto pt-2 leading-relaxed">
                Click the secure link in your email to instantly sign in and synchronize your Varanasi itineraries.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-xl bg-[#172554] py-2.5 text-xs font-semibold text-white hover:bg-[#1E3A8A] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Email Input Form */
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  disabled={isLoading || !isSupabaseConfigured}
                  className="w-full pl-10 pr-3 py-2.5 text-xs text-[#172554] rounded-xl border border-[#E8D9C0] bg-white focus:outline-none focus:ring-2 focus:ring-[#0E7490] disabled:bg-slate-100"
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Feature Highlights */}
            <div className="rounded-2xl border border-[#E8D9C0] bg-[#FAF6EF] p-3 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E7490]" />
                <span className="font-medium text-[#172554]">Passwordless & Secure</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                No password required. We email you a one-time verification link.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8D9C0]">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading || !email.trim() || !isSupabaseConfigured}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0E7490] px-4 py-2 text-xs font-semibold text-white hover:bg-[#155E75] transition-colors shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
