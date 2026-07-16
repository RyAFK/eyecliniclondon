import { Users2, CheckCircle2, Calendar, UserX } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { statToneColor, statToneBg } from '../../components/shared/statTone';
import { STATUS_RANK } from '../../data/referrals';

export function BDStatSquares({ referrals }) {
  const COLOR = useColors();
  const total = referrals.length;
  const completed = referrals.filter((r) => r.status === 'Treatment Completed').length;
  const booked = referrals.filter((r) => STATUS_RANK[r.status] >= 1).length;
  const lost = referrals.filter((r) => r.status === 'Closed').length;

  const squares = [
    { label: 'Referrals received', value: total, Icon: Users2, tone: 'default' },
    { label: 'Treatments completed', value: completed, Icon: CheckCircle2, tone: 'complete' },
    { label: 'Consultations booked', value: booked, Icon: Calendar, tone: 'teal' },
    { label: 'Lost (DNA / declined)', value: lost, Icon: UserX, tone: 'action' },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {squares.map((s, i) => (
        <div key={s.label} className="ecl-fade-up rounded-2xl p-4" style={{ animationDelay: `${i * 50}ms`, background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: statToneBg(s.tone, COLOR), color: statToneColor(s.tone, COLOR) }}>
            <s.Icon size={16} />
          </span>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>{s.value}</p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
