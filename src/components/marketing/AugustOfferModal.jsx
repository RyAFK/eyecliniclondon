import { useEffect } from 'react';
import { X, Clock3 } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { LensRings } from '../shared/EyeMotif';

export function AugustOfferModal({ open, onClose }) {
  const COLOR = useColors();
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="ecl-fade-in fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div
        className="ecl-scale-in relative mx-auto my-6 w-full max-w-md overflow-hidden rounded-2xl sm:my-10"
        style={{ background: COLOR.primary, boxShadow: '0 30px 70px -20px rgba(0,0,0,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <LensRings className="ecl-float pointer-events-none absolute -right-10 -top-12 z-0 opacity-30" size={200} />

        <button
          type="button"
          onClick={onClose}
          className="ecl-btn absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full"
          style={{ color: '#fff', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <X size={17} />
        </button>

        <div className="relative z-10 px-6 py-8 sm:px-8">
          <span
            className="ecl-glow-dot inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
            style={{ background: 'rgba(176,138,78,0.18)', color: COLOR.accent }}
          >
            <Clock3 size={12} /> Limited time · August offer
          </span>

          <h2 className="mt-3 pr-10 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            Dry eye relief, at a special price
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            This August, encourage patients with persistent dry eye symptoms to book an IPL treatment course — reduced course pricing is available for a limited time only.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p className="text-xs font-medium uppercase tracking-wide text-white/60">IPL Treatment · 4 sessions</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-medium text-white">£1,000</span>
                <span className="text-sm text-white/50 line-through">£1,200</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Save £200 on the full course</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p className="text-xs font-medium uppercase tracking-wide text-white/60">Eyes + Face IPL</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-medium text-white">£1,333</span>
                <span className="text-sm text-white/50 line-through">£1,600</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Save £267 on the full course</p>
            </div>
          </div>

          <p className="mt-5 text-xs text-white/50">Offer available throughout August 2026 · speak to our team for full terms.</p>
        </div>
      </div>
    </div>
  );
}
