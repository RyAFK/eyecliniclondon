'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Hourglass, ShieldCheck, UserPlus } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings, EyeMotif } from '@/components/ui/motifs';
import { AugustOfferModal } from '@/components/dashboard/august-offer-modal';

export function DashboardHero({ firstName, practiceName }: { firstName: string; practiceName: string }) {
  const [showOffer, setShowOffer] = useState(false);

  return (
    <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
      <AugustOfferModal open={showOffer} onClose={() => setShowOffer(false)} />
      <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
      <div className="relative grid grid-cols-1 items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <ShieldCheck size={14} /> Referring Partner Portal
          </p>
          <h1 className="mt-2 text-3xl text-white sm:text-4xl" style={FONT_DISPLAY}>
            Good morning, {firstName}
          </h1>
          <p className="mt-2 text-sm text-white/70">{practiceName}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/dashboard/refer"
              className="ecl-btn ecl-press inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
              style={{ background: COLOR.accent, color: COLOR.primary }}
            >
              <UserPlus size={16} /> Refer a Patient <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setShowOffer(true)}
              className="ecl-btn ecl-press inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
              style={{ background: COLOR.accentTint, color: COLOR.accent }}
            >
              <Hourglass size={16} /> Limited Offers
            </button>
          </div>
        </div>
        <div className="ecl-breathe hidden justify-self-center md:flex">
          <EyeMotif size={170} />
        </div>
      </div>
    </div>
  );
}
