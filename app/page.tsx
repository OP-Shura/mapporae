import React from 'react';
import Link from 'next/link';
import { HeroSearch } from '@/components/home/HeroSearch';
import { WeatherCard } from '@/components/home/WeatherCard';
import { AirQualityCard } from '@/components/home/AirQualityCard';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedPlaces } from '@/components/home/FeaturedPlaces';
import { HappeningNow } from '@/components/home/HappeningNow';
import { MiniMapPreview } from '@/components/map/MiniMapPreview';
import { getFeaturedPlaces } from '@/lib/api/places';
import { fetchCurrentWeather } from '@/lib/api/weather';
import { fetchCurrentAirQuality } from '@/lib/api/air-quality';
import { ArrowRight, MapPin } from 'lucide-react';

export default async function HomePage() {
  const [featuredPlaces, weatherData, aqiData] = await Promise.all([
    getFeaturedPlaces(),
    fetchCurrentWeather(),
    fetchCurrentAirQuality(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-10">
      {/* 1. Hero Search Section */}
      <HeroSearch />

      {/* 2. Live Varanasi Environment Signals (Weather & Air Quality) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#172554] sm:text-xl">
              Live City Signals
            </h2>
            <p className="text-xs text-slate-500">
              Real-time atmospheric condition along the Ganga Ghats
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherCard initialData={weatherData} />
          <AirQualityCard initialData={aqiData} />
        </div>
      </section>

      {/* 3. Browse by City Categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#172554] sm:text-xl">
              What are you looking for?
            </h2>
            <p className="text-xs text-slate-500">
              Browse Varanasi by curated civic and travel categories
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-1 text-xs font-bold text-[#0E7490] hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryGrid />
      </section>

      {/* 4. Happening in Kashi (Ganga Aarti, Subah-e-Banaras) */}
      <HappeningNow />

      {/* 5. Featured Kashi Landmarks & Ghats */}
      <FeaturedPlaces places={featuredPlaces} />

      {/* 6. Interactive Mini Map Callout */}
      <section className="rounded-3xl border border-[#E8D9C0] bg-[#FAF6EF] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Interactive City Map
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#172554] border border-[#E8D9C0]">
                Live Leaflet View
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-[#172554]">
              Explore Kashi from Rajghat to Assi
            </h3>
            <p className="text-xs text-slate-600">
              Pan across the riverfront, click pins to discover ghat history, temple corridors, and nearby essentials.
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-xl bg-[#172554] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3A8A] transition-colors shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Open Full Interactive Map</span>
          </Link>
        </div>

        <MiniMapPreview
          places={featuredPlaces}
          height="h-72"
          showExploreLink={true}
        />
      </section>
    </div>
  );
}
