'use client';

import React, { useState } from 'react';
import { 
  BOAT_TYPES, 
  TRIP_TYPES, 
  calculateBoatFare, 
  BoatType, 
  TripType 
} from '@/lib/utils/boat-calculator';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Anchor, 
  Users, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Info,
  CheckCircle2
} from 'lucide-react';

export function BoatFareCalculator() {
  const { isHindi } = useLanguage();
  const [boatType, setBoatType] = useState<BoatType>('rowing');
  const [tripType, setTripType] = useState<TripType>('sunrise_cruise');
  const [passengers, setPassengers] = useState<number>(2);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);

  const estimate = calculateBoatFare({
    boatType,
    tripType,
    passengers,
    isPrivate,
  });

  return (
    <div className="rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF] dark:bg-slate-900 p-5 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8D9C0] dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E0F2FE] dark:bg-cyan-950/80 text-[#0E7490] dark:text-[#38BDF8]">
              <Anchor className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-[#172554] dark:text-white">
              {isHindi ? 'गंगा नौका किराया कैलकुलेटर' : 'Ganga Boat Fare & Tariff Estimator'}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {isHindi
              ? 'वाराणसी नगर निगम और जल पुलिस दिशानिर्देशों के अनुसार उचित एवं पारदर्शी किराया दरें।'
              : 'Fair price estimates based on Varanasi municipal benchmarks & seasonal river traffic.'}
          </p>
        </div>

        {/* Private vs Shared Toggle */}
        <div className="inline-flex rounded-2xl bg-white dark:bg-slate-800 p-1 border border-[#E8D9C0] dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsPrivate(true)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              isPrivate
                ? 'bg-[#172554] dark:bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'पूरी निजी नाव' : 'Private Boat'}
          </button>
          <button
            type="button"
            onClick={() => setIsPrivate(false)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              !isPrivate
                ? 'bg-[#172554] dark:bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'प्रति व्यक्ति (शेयरिंग)' : 'Per-Seat (Shared)'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Trip Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {isHindi ? '1. यात्रा का प्रकार चुनें' : '1. Select Journey / Experience'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TRIP_TYPES.map(trip => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setTripType(trip.id)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                    tripType === trip.id
                      ? 'border-[#0E7490] dark:border-[#38BDF8] bg-white dark:bg-slate-800 shadow-sm ring-2 ring-[#0E7490]/20'
                      : 'border-[#E8D9C0] dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-[#172554] dark:text-white">
                    {isHindi ? trip.hindiName : trip.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {trip.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Boat Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {isHindi ? '2. नाव का प्रकार चुनें' : '2. Select Boat Type'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BOAT_TYPES.map(boat => (
                <button
                  key={boat.id}
                  type="button"
                  onClick={() => setBoatType(boat.id)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                    boatType === boat.id
                      ? 'border-[#0E7490] dark:border-[#38BDF8] bg-white dark:bg-slate-800 shadow-sm ring-2 ring-[#0E7490]/20'
                      : 'border-[#E8D9C0] dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-[#172554] dark:text-white">
                    {isHindi ? boat.hindiName : boat.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {boat.capacity}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Passengers Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isHindi ? '3. यात्रियों की संख्या' : '3. Number of Passengers'}
              </label>
              <span className="rounded-lg bg-[#E0F2FE] dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-[#0E7490] dark:text-[#38BDF8] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {passengers} {passengers === 1 ? (isHindi ? 'यात्री' : 'Person') : (isHindi ? 'यात्री' : 'People')}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={passengers}
              onChange={e => setPassengers(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0E7490]"
            />
          </div>
        </div>

        {/* Estimation Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D9C0] dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isHindi ? 'उचित किराया अनुमान' : 'Fair Fare Estimate'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHindi ? 'सत्यापित दर' : 'Verified Range'}
              </span>
            </div>

            {/* Total Price */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPrivate
                  ? isHindi
                    ? 'संपूर्ण निजी नाव का अनुशंसित किराया'
                    : 'Recommended Total for Private Boat'
                  : isHindi
                    ? 'कुल किराया'
                    : 'Total Fare'}
              </p>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#172554] dark:text-white font-mono">
                  ₹{estimate.minPrice} – ₹{estimate.maxPrice}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8] mt-1">
                {isHindi
                  ? `उचित औसत दर: लगभग ₹${estimate.recommendedPrice}`
                  : `Fair Target: ~₹${estimate.recommendedPrice} total`}
                {isPrivate && passengers > 1 && (
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    (₹{estimate.pricePerPerson} {isHindi ? 'प्रति व्यक्ति' : 'per person'})
                  </span>
                )}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[#FAF6EF] dark:bg-slate-900 p-2.5 border border-[#E8D9C0] dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{isHindi ? 'अवधि' : 'Duration'}</p>
                <p className="font-bold text-[#172554] dark:text-white mt-0.5">{estimate.durationMinutes} mins</p>
              </div>
              <div className="rounded-xl bg-[#FAF6EF] dark:bg-slate-900 p-2.5 border border-[#E8D9C0] dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{isHindi ? 'मार्ग दूरी' : 'River Distance'}</p>
                <p className="font-bold text-[#172554] dark:text-white mt-0.5">{estimate.distanceKm} km</p>
              </div>
            </div>

            {/* Tips Box */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isHindi ? 'नाविक से बातचीत हेतु सुझाव' : 'Key Boat Etiquette & Tips'}:
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {(isHindi ? estimate.hindiTips : estimate.tips).slice(0, 3).map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7490] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#E8D9C0]/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-[#0E7490] shrink-0" />
            <span>
              {isHindi
                ? 'त्योहारों (देव दीपावली, महाशिवरात्रि) पर दरों में परिवर्तन संभव है।'
                : 'Rates may vary during high festivals such as Dev Deepawali and Mahashivratri.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
