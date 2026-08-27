import React from 'react';
import { EMERGENCY_NUMBERS } from '@/lib/data/services';
import { PhoneCall, ShieldAlert, AlertTriangle, LifeBuoy, HeartPulse, Compass, UserCheck, Flame, ExternalLink } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert,
  HeartPulse,
  Compass,
  UserCheck,
  Flame,
  LifeBuoy,
};

export function EmergencyHeader() {
  return (
    <div className="space-y-4">
      {/* Mandatory Safety Notice / Disclaimer Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-xs text-amber-950 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">
            Emergency & Safety Notice
          </h4>
          <p className="leading-relaxed">
            Data may change; confirm critical medical, police, or emergency service information directly. In life-threatening emergencies, dial <strong className="underline font-black">112</strong> or <strong className="underline font-black">108</strong> immediately from any mobile network.
          </p>
        </div>
      </div>

      {/* Grid of 1-Tap Emergency Dialers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EMERGENCY_NUMBERS.map(service => {
          const IconComp = ICON_MAP[service.icon] || PhoneCall;

          return (
            <div
              key={service.name}
              className="flex flex-col justify-between rounded-2xl border border-[#E8D9C0] bg-white p-4 shadow-xs transition-all hover:border-red-400 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${service.color} shadow-xs`}>
                    <IconComp className="w-5 h-5" />
                  </span>

                  <a
                    href={`tel:${service.number.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-1 text-sm font-black text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full border border-red-200 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    {service.number}
                  </a>
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#172554]">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{service.hindiName}</p>

                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${service.number.replace(/[^0-9+]/g, '')}`}
                  className="font-semibold text-red-700 hover:underline flex items-center gap-1"
                >
                  <span>Tap to dial</span>
                  <span>→</span>
                </a>

                {service.sourceUrl && (
                  <a
                    href={service.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-[#0E7490] inline-flex items-center gap-0.5"
                    title={`Source: ${service.sourceName}`}
                  >
                    <span>Official Portal</span>
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
