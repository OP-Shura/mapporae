import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { PlaceCategory } from '@/lib/types';

interface VisitorTipCardProps {
  tip?: string;
  category: PlaceCategory;
}

export function VisitorTipCard({ tip, category }: VisitorTipCardProps) {
  if (!tip) return null;

  const getCategoryAdvice = (cat: PlaceCategory) => {
    switch (cat) {
      case 'ghats':
        return 'Standard wooden boat fares from Assi to Dashashwamedh are typically ₹150–₹250 per person on shared boats, or ₹800–₹1,200 for a private boat for 1 hour. Fix the price before stepping aboard.';
      case 'temples':
        return 'Modest traditional dress is advised. Keep shoes at the authorized government counters. Free lockers for phones/wallets are available inside corridor security checkpoints.';
      case 'food':
        return 'Look for freshly cooked hot chaat served in clay kullads. Banarasi Tamatar Chaat and hot Gulab Jamun in winter or Malaiyyo in the morning are unmissable.';
      default:
        return 'Carry a small water bottle and cash in small denominations for e-rickshaws and local stalls.';
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-[#FFFDF9] to-amber-50/50 p-5 shadow-xs">
      <div className="flex items-center gap-2 text-amber-900 font-bold mb-2">
        <Sparkles className="w-5 h-5 text-[#D97706]" />
        <h3 className="text-sm uppercase tracking-wider">Local Varanasi Guide Tips</h3>
      </div>

      <p className="text-xs text-amber-950 leading-relaxed font-medium">
        {tip}
      </p>

      <div className="mt-3 pt-3 border-t border-amber-200/80 text-[11px] text-amber-800/90 leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
        <span>{getCategoryAdvice(category)}</span>
      </div>
    </div>
  );
}
