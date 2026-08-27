import React from 'react';
import { EmergencyHeader } from '@/components/services/EmergencyHeader';
import { ServiceDirectory } from '@/components/services/ServiceDirectory';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Essential & Emergency Services — Mapporae Varanasi',
  description: 'Emergency dialers (112, 108), 24x7 hospitals, chemist shops, police stations, and public toilets in Varanasi.',
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-8">
      {/* Title & Introduction */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Civic Safety & Emergency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554]">
          Essential & Emergency Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Fast-access helpline dialers, 24/7 trauma care, chemists, tourist police, and public sanitation complexes across Varanasi.
        </p>
      </div>

      {/* 1. Emergency Dialers & Safety Notice Banner */}
      <EmergencyHeader />

      {/* 2. Directory Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#E8D9C0] pb-2">
          <div>
            <h2 className="text-lg font-bold text-[#172554]">
              Civic Services Directory
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by real-time distance from your reference spot
            </p>
          </div>
        </div>

        <ServiceDirectory />
      </section>
    </div>
  );
}
