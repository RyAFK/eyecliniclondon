import { useState } from 'react';
import { ListChecks } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { LensRings } from '../../components/shared/EyeMotif';
import { Pill } from '../../components/shared/Pill';
import { CountUp } from '../../components/shared/CountUp';
import { statToneColor, statToneBg } from '../../components/shared/statTone';
import { STAT_CARDS } from '../../data/content';
import { STATUS_TONE } from '../../data/referrals';
import { StatDetailModal } from './StatDetailModal';

export function ReferralsPage({ referrals }) {
  const COLOR = useColors();
  const [activeStat, setActiveStat] = useState(null);
  const mine = (referrals || []).filter((r) => r.practice === 'Keith Holland Opticians');
  return (
    <div>
      <StatDetailModal stat={activeStat} onClose={() => setActiveStat(null)} />

      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <ListChecks size={14} /> Keith Holland Opticians
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>My referrals</h1>
          <p className="mt-2 text-sm text-white/70">
            {mine.length} referral{mine.length !== 1 ? 's' : ''} sent to Eye Clinic London.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActiveStat(c)}
            className="ecl-fade-up ecl-lift ecl-press rounded-2xl p-4 text-left"
            style={{ animationDelay: `${i * 60}ms`, background: COLOR.bg, border: `1px solid ${COLOR.border}` }}
          >
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: statToneBg(c.tone, COLOR), color: statToneColor(c.tone, COLOR) }}>
              <c.Icon size={16} />
            </span>
            <p className="text-2xl font-medium" style={{ color: COLOR.text }}><CountUp value={c.value} /></p>
            <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>{c.label}</p>
          </button>
        ))}
      </div>

      <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <h2 className="mb-4 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
          <ListChecks size={16} style={{ color: COLOR.secondary }} /> Recent referrals
        </h2>
        <ul className="space-y-2.5">
          {mine.length === 0 && (
            <li className="rounded-xl p-6 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
              No referrals yet — submit one via "Refer a Patient".
            </li>
          )}
          {mine.map((r, i) => (
            <li key={r.id || i} className="ecl-fade-up flex items-center justify-between gap-3 rounded-xl p-3.5" style={{ animationDelay: `${i * 50}ms`, background: COLOR.recessed }}>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.patient} · {r.treatment}</p>
                <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>{r.date} · £{r.fee}</p>
              </div>
              <Pill tone={STATUS_TONE[r.status] || 'default'}>{r.status}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
