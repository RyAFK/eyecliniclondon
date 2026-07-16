import { useColors } from '../../theme/colors';
import { STATUS_RANK } from '../../data/referrals';

export function PatientJourneyFunnel({ referrals }) {
  const COLOR = useColors();
  const stages = [
    { label: 'Referrals received', count: referrals.length },
    { label: 'Consultations booked', count: referrals.filter((r) => STATUS_RANK[r.status] >= 1).length },
    { label: 'Treatments booked', count: referrals.filter((r) => STATUS_RANK[r.status] >= 2).length },
    { label: 'Treatments completed', count: referrals.filter((r) => STATUS_RANK[r.status] >= 3).length },
  ];
  const maxCount = stages[0].count || 1;

  return (
    <div className="ecl-fade-up mt-6 overflow-hidden rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 font-medium" style={{ color: COLOR.text }}>Patient journey funnel</h2>
      <div className="space-y-3">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].count : null;
          const lost = prev !== null ? prev - s.count : 0;
          const lostPct = prev ? Math.round((lost / prev) * 100) : 0;
          const widthPct = Math.max((s.count / maxCount) * 100, 14);
          return (
            <div key={s.label}>
              {i > 0 && lost > 0 && (
                <p className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: COLOR.problem }}>
                  ↓ {lost} lost ({lostPct}%)
                </p>
              )}
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: COLOR.textMuted }}>{s.label}</span>
                <span className="font-semibold" style={{ color: COLOR.text }}>{s.count}</span>
              </div>
              <div className="mt-1 h-3 w-full overflow-hidden rounded-full" style={{ background: COLOR.recessed }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${COLOR.primary} 0%, ${COLOR.accent} 100%)`,
                    transition: 'width 500ms ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
