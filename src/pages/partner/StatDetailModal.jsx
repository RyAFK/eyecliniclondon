import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { statToneColor, statToneBg } from '../../components/shared/statTone';
import { STAT_EXAMPLES } from '../../data/content';

export function StatDetailModal({ stat, onClose }) {
  const COLOR = useColors();
  useEffect(() => {
    if (!stat) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [stat]);
  if (!stat) return null;
  const data = STAT_EXAMPLES[stat.id];
  return (
    <div className="ecl-fade-in fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div className="ecl-scale-in mx-auto my-6 w-full max-w-md rounded-2xl p-6 sm:my-10" style={{ background: COLOR.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: statToneBg(stat.tone, COLOR), color: statToneColor(stat.tone, COLOR) }}>
              <stat.Icon size={18} />
            </span>
            <div>
              <h3 style={{ ...FONT_DISPLAY, fontSize: '1.1rem', color: COLOR.text }}>{stat.label}</h3>
              <p className="text-xs" style={{ color: COLOR.textMuted }}>{stat.value} referrals total</p>
            </div>
          </div>
          <button onClick={onClose} className="ecl-btn flex h-8 w-8 items-center justify-center rounded-full" style={{ color: COLOR.textMuted, background: COLOR.recessed }}>
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm" style={{ color: COLOR.textMuted }}>{data.description}</p>

        <ul className="mt-4 space-y-2.5">
          {data.rows.map((r, i) => (
            <li key={r.patient} className="ecl-fade-up rounded-xl p-3.5" style={{ animationDelay: `${i * 60}ms`, background: COLOR.recessed }}>
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.patient} · {r.treatment}</p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>{r.detail}</p>
            </li>
          ))}
        </ul>

        {data.moreCount > 0 && (
          <p className="mt-3 text-center text-xs font-medium" style={{ color: COLOR.textMuted }}>
            + {data.moreCount} more referral{data.moreCount !== 1 ? 's' : ''} not shown
          </p>
        )}

        <p className="mt-4 text-xs" style={{ color: COLOR.textMuted }}>Example records shown for illustration only.</p>
      </div>
    </div>
  );
}
