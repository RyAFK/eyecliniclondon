import { useState } from 'react';
import { ShieldCheck, UserPlus, ArrowRight, Hourglass } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { LensRings, EyeMotif } from '../../components/shared/EyeMotif';
import { TrustpilotCarousel } from '../../components/marketing/TrustpilotCarousel';
import { AugustOfferModal } from '../../components/marketing/AugustOfferModal';

export function Dashboard({ onRefer }) {
  const COLOR = useColors();
  const [showOffer, setShowOffer] = useState(false);

  return (
    <div>
      <AugustOfferModal open={showOffer} onClose={() => setShowOffer(false)} />

      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative grid grid-cols-1 items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
              <ShieldCheck size={14} /> Referring Partner Portal
            </p>
            <h1 className="mt-2 text-3xl text-white sm:text-4xl" style={FONT_DISPLAY}>Good morning, Jane</h1>
            <p className="mt-2 text-sm text-white/70">Keith Holland Opticians</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={onRefer}
                className="ecl-btn ecl-press inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
                style={{ background: COLOR.accent, color: COLOR.primary }}
              >
                <UserPlus size={16} /> Refer a Patient <ArrowRight size={16} />
              </button>
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

      <TrustpilotCarousel />
    </div>
  );
}
