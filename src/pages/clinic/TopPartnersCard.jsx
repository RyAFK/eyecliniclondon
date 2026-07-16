import { ArrowRight } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { practiceBreakdown } from '../../data/referrals';

export function TopPartnersCard({ referrals, onViewAll }) {
  const COLOR = useColors();
  const ranked = practiceBreakdown(referrals).slice(0, 3);

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium" style={{ color: COLOR.text }}>Top referral partners</h2>
        <button onClick={onViewAll} className="ecl-underline flex items-center gap-1 text-sm font-medium" style={{ color: COLOR.accent }}>
          View all <ArrowRight size={13} />
        </button>
      </div>
      <ul className="divide-y" style={{ borderColor: COLOR.border }}>
        {ranked.map((p) => (
          <li key={p.practice} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>{p.practice}</p>
              <p className="text-xs" style={{ color: COLOR.textMuted }}>{p.count} referrals · {p.treated} treated</p>
            </div>
            <p className="shrink-0 text-sm font-semibold" style={{ color: COLOR.complete }}>{p.share}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
