import { COLOR } from '@/lib/theme';
import { outcomeBreakdown } from '@/services/analytics.service';
import { REFERRAL_OUTCOME_LABELS, type Referral } from '@/types/referral';

export function OutcomeBreakdown({ referrals }: { referrals: Referral[] }) {
  const rows = outcomeBreakdown(referrals).sort((a, b) => b.count - a.count);
  const total = rows.reduce((s, r) => s + r.count, 0) || 1;
  const positiveCount = rows.filter((r) => r.positive).reduce((s, r) => s + r.count, 0);

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium" style={{ color: COLOR.text }}>
          Closed referral outcomes
        </h2>
        <span className="text-xs" style={{ color: COLOR.complete }}>
          {Math.round((positiveCount / total) * 100)}% positive outcome
        </span>
      </div>
      <p className="mb-4 text-xs leading-relaxed" style={{ color: COLOR.textMuted }}>
        Journey status only tells you a referral is closed — outcome tells you why. Not every closed referral is a lost patient.
      </p>
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.outcome}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: COLOR.text }}>{REFERRAL_OUTCOME_LABELS[r.outcome as keyof typeof REFERRAL_OUTCOME_LABELS]}</span>
              <span className="font-medium" style={{ color: COLOR.text }}>
                {r.count}
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full" style={{ background: COLOR.recessed }}>
              <div
                style={{
                  width: `${Math.max((r.count / total) * 100, 3)}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: r.positive ? COLOR.complete : COLOR.future,
                }}
              />
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="rounded-xl p-4 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
            No closed referrals yet.
          </li>
        )}
      </ul>
    </div>
  );
}
