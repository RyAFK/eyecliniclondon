'use client';

import { Clock3 } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Modal } from '@/components/ui/modal';
import { LensRings } from '@/components/ui/motifs';

export function AugustOfferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="relative -m-6 overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-float pointer-events-none absolute -right-10 -top-12 z-0 opacity-30" size={200} />
        <div className="relative z-10 px-6 py-8 sm:px-8">
          <span className="ecl-glow-dot inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide" style={{ background: 'rgba(176,138,78,0.18)', color: COLOR.accent }}>
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
    </Modal>
  );
}
