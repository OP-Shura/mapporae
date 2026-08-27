'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';

interface AartiEvent {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  hindiLocation: string;
  targetHour: number; // 24h format
  targetMinute: number;
  description: string;
  hindiDescription: string;
  placeId: string;
}

const AARTIS: AartiEvent[] = [
  {
    id: 'subah-e-banaras',
    name: 'Subah-e-Banaras Morning Aarti',
    hindiName: 'सुबह-ए-बनारस प्रभात आरती',
    location: 'Assi Ghat',
    hindiLocation: 'अस्सी घाट',
    targetHour: 5,
    targetMinute: 30,
    description: 'Vedic chants, sunrise Ganga worship, classical shehnai ragas, and morning yoga.',
    hindiDescription: 'वेदमंत्र, सूर्योदय गंगा वंदना, शास्त्रीय राग और प्रभात योग।',
    placeId: 'assi-ghat',
  },
  {
    id: 'sandhya-ganga-aarti',
    name: 'Sandhya Maha Ganga Aarti',
    hindiName: 'संध्या महा गंगा आरती',
    location: 'Dashashwamedh Ghat',
    hindiLocation: 'दशाश्वमेध घाट',
    targetHour: 18,
    targetMinute: 45,
    description: 'World-famous multi-tiered brass lamp ritual performed by seven Vedic priests.',
    hindiDescription: 'सात अर्चकों द्वारा पीतल के भव्य दीपदान से संपन्न होने वाली विश्वविख्यात महाआरती।',
    placeId: 'dashashwamedh-ghat',
  },
];

function calculateTimeRemaining(targetHour: number, targetMinute: number) {
  const now = new Date();
  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // Already passed today, calculate for tomorrow
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, isImminent: totalSeconds < 3600 };
}

export function AartiCountdown() {
  const { isHindi } = useLanguage();
  const [times, setTimes] = useState(() =>
    AARTIS.map(a => calculateTimeRemaining(a.targetHour, a.targetMinute))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimes(AARTIS.map(a => calculateTimeRemaining(a.targetHour, a.targetMinute)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {AARTIS.map((aarti, idx) => {
        const time = times[idx] || { hours: 0, minutes: 0, seconds: 0, isImminent: false };

        return (
          <div
            key={aarti.id}
            className="relative overflow-hidden rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-gradient-to-br from-[#FAF6EF] via-white to-[#F4E7D3]/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>
                  {aarti.targetHour < 12
                    ? `${aarti.targetHour}:${aarti.targetMinute.toString().padStart(2, '0')} AM`
                    : `${aarti.targetHour - 12}:${aarti.targetMinute.toString().padStart(2, '0')} PM`}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#0E7490] dark:text-[#38BDF8]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isHindi ? aarti.hindiLocation : aarti.location}</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-3">
              <h3 className="text-base font-bold text-[#172554] dark:text-white">
                {isHindi ? aarti.hindiName : aarti.name}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi ? aarti.hindiDescription : aarti.description}
              </p>
            </div>

            {/* Live Countdown Clock */}
            <div className="mt-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-[#E8D9C0]/80 dark:border-slate-800 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'अगली आरती में शेष समय:' : 'Starts in:'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#172554] dark:text-amber-400">
                <span className="rounded-lg bg-amber-50 dark:bg-slate-800 px-2 py-1 border border-amber-200 dark:border-slate-700">
                  {time.hours.toString().padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="rounded-lg bg-amber-50 dark:bg-slate-800 px-2 py-1 border border-amber-200 dark:border-slate-700">
                  {time.minutes.toString().padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="rounded-lg bg-amber-50 dark:bg-slate-800 px-2 py-1 border border-amber-200 dark:border-slate-700">
                  {time.seconds.toString().padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Action Link */}
            <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-[#E8D9C0]/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isHindi ? 'सर्वोत्तम दर्शन: 30 मिनट पहले पहुंचे' : 'Tip: Arrive 30 mins early'}
              </span>

              <Link
                href={`/place/${aarti.placeId}`}
                className="font-bold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
              >
                {isHindi ? 'घाट विवरण देखें →' : 'View Ghat on Map →'}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
