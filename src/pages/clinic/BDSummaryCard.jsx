import { useState } from 'react';
import { Sparkle, ChevronDown, Lightbulb, Phone, TrendingUp, Star } from 'lucide-react';
import { useColors } from '../../theme/colors';

export function BDSummaryCard({ referrals, topPractice }) {
  const COLOR = useColors();
  const [open, setOpen] = useState(true);
  const awaiting = referrals.filter((r) => r.status === 'Awaiting Consultation' || r.status === 'Referral Received').length;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="ecl-btn ecl-press flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4"
        style={{ background: COLOR.primary }}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkle size={16} style={{ color: COLOR.accent }} /> Business development summary
        </span>
        <ChevronDown size={18} style={{ color: '#fff', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 250ms ease' }} />
      </button>

      {open && (
        <div className="ecl-fade-in mt-3 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: COLOR.text }}>
            <Lightbulb size={16} style={{ color: COLOR.accent }} /> Growth opportunities
          </p>
          <ul className="divide-y" style={{ borderColor: COLOR.border }}>
            <li className="flex items-start gap-3 py-3 first:pt-0">
              <Phone size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
              <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                {awaiting} patient{awaiting !== 1 ? 's have' : ' has'} waited without a consultation booking. Contact them this week.
              </p>
            </li>
            <li className="flex items-start gap-3 py-3">
              <TrendingUp size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
              <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                Dry Eye referrals have grown fastest recently — worth featuring in partner communications.
              </p>
            </li>
            <li className="flex items-start gap-3 py-3 last:pb-0">
              <Star size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
              <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                {topPractice || 'Keith Holland Opticians'} is actively referring — a good moment to introduce a new treatment pathway.
              </p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
