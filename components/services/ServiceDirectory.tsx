'use client';

import React, { useState } from 'react';
import { ESSENTIAL_SERVICES_DATA } from '@/lib/data/services';
import { useLocation } from '@/lib/context/LocationContext';
import { DistanceBadge, StatusBadge } from '@/components/ui/Badge';
import { 
  HeartPulse, 
  Pill, 
  Shield, 
  Banknote, 
  DoorOpen, 
  PhoneCall, 
  Navigation, 
  MapPin, 
  Clock, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services', icon: Sparkles },
  { id: 'hospital', label: 'Hospitals & Trauma', icon: HeartPulse },
  { id: 'pharmacy', label: '24x7 Pharmacies', icon: Pill },
  { id: 'police', label: 'Police & Tourist Assistance', icon: Shield },
  { id: 'atm', label: 'Cash ATMs', icon: Banknote },
  { id: 'toilet', label: 'Sulabh Public Toilets', icon: DoorOpen },
];

export function ServiceDirectory() {
  const { getDistanceTo } = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = ESSENTIAL_SERVICES_DATA.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.specialty && service.specialty.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    const distA = getDistanceTo(a.coordinates);
    const distB = getDistanceTo(b.coordinates);
    return distA - distB;
  });

  return (
    <div className="space-y-5">
      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0E7490] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-[#E8D9C0] hover:border-[#0E7490]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, ATMs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8D9C0] bg-white focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
          />
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(service => {
          const distance = getDistanceTo(service.coordinates);
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${service.coordinates.lat},${service.coordinates.lng}`;

          return (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E8D9C0] bg-white p-4 shadow-xs transition-all hover:border-[#0E7490] hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E7490]">
                      {service.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-[#172554] mt-0.5 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <StatusBadge
                    status={service.status}
                    sourceUrl={service.sourceUrl}
                    verifiedAt={service.verifiedAt}
                  />
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0E7490] shrink-0 mt-0.5" />
                    <span>{service.address}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-[#172554]">{service.openHours}</span>
                  </div>

                  {service.specialty && (
                    <div className="mt-2 rounded-lg bg-[#FAF6EF] p-2 text-[11px] text-slate-700 border border-[#E8D9C0]">
                      <span className="font-semibold text-[#172554]">Facilities: </span>
                      <span>{service.specialty}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons & Distance */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <DistanceBadge distanceKm={distance} />

                <div className="flex items-center gap-2">
                  {service.phone !== 'N/A' && (
                    <a
                      href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-1 rounded-xl bg-[#FAF6EF] border border-[#E8D9C0] px-3 py-1.5 text-xs font-semibold text-[#172554] hover:bg-[#E0F2FE] hover:text-[#0E7490] transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call</span>
                    </a>
                  )}

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-xl bg-[#0E7490] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#155E75] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>

              {/* Data Hygiene & Source Section */}
              <div className="mt-3 pt-2 border-t border-[#E8D9C0]/50 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                <span>
                  Curated record · Last reviewed {new Date(service.lastUpdated).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>

                {service.sourceUrl && (
                  <a
                    href={service.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0E7490] hover:underline inline-flex items-center gap-0.5 font-medium"
                  >
                    <span>{service.sourceName || 'Source'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
