import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { MapPin, ExternalLink, Waves, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF]/80 dark:bg-[#080D1A]/90 pb-24 pt-14 md:pb-12 text-[#172554] dark:text-slate-200 transition-colors backdrop-blur-xl">
      {/* Background Soft River Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#E0F2FE]/50 dark:bg-cyan-950/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#FEF3C7]/40 dark:bg-amber-950/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3.5">
            <Logo size="lg" showTagline={true} />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm font-medium">
              Mapporae is a calm, mobile-first civic and travel companion for Varanasi (Kashi). Discover ancient ghats, revered temple corridors, authentic street chaat, live weather, air quality, and curated essential services from one simple dashboard.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8]">
              <MapPin className="w-4 h-4 text-[#F59E0B]" />
              <span>Varanasi, Uttar Pradesh 221001, India</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8] mb-3.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Explore Kashi</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/explore?category=ghats" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Sacred Ghats & Ganga River
                </Link>
              </li>
              <li>
                <Link href="/explore?category=temples" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Kashi Temples & Shrines
                </Link>
              </li>
              <li>
                <Link href="/explore?category=food" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Banarasi Chaat & Lassi
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Walking Trails & Boat Tariffs
                </Link>
              </li>
              <li>
                <Link href="/explore?category=transport" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Boats & Railway Stations
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic & Safety */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8] mb-3.5 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-[#0E7490]" />
              <span>Civic & Safety</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/services" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] font-bold text-rose-700 dark:text-rose-400">
                  Emergency Helplines (112 / 108)
                </Link>
              </li>
              <li>
                <Link href="/explore?category=hospitals" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  24x7 Hospitals & Trauma
                </Link>
              </li>
              <li>
                <Link href="/explore?category=pharmacies" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Round-the-clock Chemists
                </Link>
              </li>
              <li>
                <Link href="/explore?category=atms" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Cash ATMs Near Ghats
                </Link>
              </li>
              <li>
                <Link href="/explore?category=toilets" className="hover:text-[#0E7490] dark:hover:text-[#38BDF8] hover:underline">
                  Sulabh Public Toilets
                </Link>
              </li>
            </ul>
          </div>

          {/* Attribution & Legal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0E7490] dark:text-[#38BDF8] mb-3.5">
              Open Data & Credits
            </h4>
            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>
                Map data ©{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0E7490] dark:text-[#38BDF8] underline inline-flex items-center gap-0.5"
                >
                  OpenStreetMap
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>{' '}
                contributors.
              </p>
              <p>
                Live Weather & AQI via{' '}
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0E7490] dark:text-[#38BDF8] underline inline-flex items-center gap-0.5"
                >
                  Open-Meteo
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>.
              </p>
              <p className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Curated for traveler safety and civic convenience in Varanasi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 pt-6 border-t border-[#E8D9C0]/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built with reverence for</span>
            <span className="font-extrabold text-[#172554] dark:text-slate-100">Varanasi (Kashi)</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-0.5" />
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
            <span>Mapporae v1.0</span>
            <span>•</span>
            <Link href="/services" className="hover:underline text-[#0E7490] dark:text-[#38BDF8]">
              Emergency Desk
            </Link>
            <span>•</span>
            <span>Liquid Glass & PWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
