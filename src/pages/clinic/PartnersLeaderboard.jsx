import { Crown } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { practiceBreakdown } from '../../data/referrals';

export function PartnersLeaderboard({ referrals }) {
  const COLOR = useColors();
  const ranked = practiceBreakdown(referrals);

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
        <Crown size={16} style={{ color: COLOR.accent }} /> Referring partners
      </h2>
      <ul className="space-y-2.5">
        {ranked.map((p, i) => (
          <li key={p.practice} className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: i === 0 ? COLOR.accentTint : COLOR.recessed }}>
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: i === 0 ? COLOR.accent : COLOR.bg, color: i === 0 ? '#fff' : COLOR.textMuted, border: i === 0 ? 'none' : `1px solid ${COLOR.border}` }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>{p.practice}</p>
                <p className="text-xs" style={{ color: COLOR.textMuted }}>{p.count} referral{p.count !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-medium" style={{ color: COLOR.text }}>£{p.fees}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
