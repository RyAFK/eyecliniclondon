import { useColors } from '../../theme/colors';
import { PageHeader } from '../../components/layout/PageHeader';
import { Pill } from '../../components/shared/Pill';
import { STATUS_TONE } from '../../data/referrals';

export function AdminActivityPage({ referrals }) {
  const COLOR = useColors();
  return (
    <div>
      <PageHeader eyebrow="Business Development" title="Activity" description="Recent referral activity across all partners." />
      <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <ul className="divide-y" style={{ borderColor: COLOR.border }}>
          {referrals.slice(0, 8).map((r, i) => (
            <li key={r.id || i} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.patient} · {r.treatment}</p>
                <p className="text-xs" style={{ color: COLOR.textMuted }}>{r.practice} · {r.date}</p>
              </div>
              <Pill tone={STATUS_TONE[r.status] || 'default'}>{r.status}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
