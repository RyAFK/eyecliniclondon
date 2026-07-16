import { Bell } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { PageHeader } from '../../components/layout/PageHeader';
import { Pill } from '../../components/shared/Pill';
import { STATUS_TONE } from '../../data/referrals';

export function NotificationsPage({ referrals }) {
  const COLOR = useColors();
  const mine = (referrals || []).filter((r) => r.practice === 'Keith Holland Opticians');

  return (
    <div>
      <PageHeader
        eyebrow="Stay up to date"
        title="Notifications"
        description="Status updates for the referrals you've sent to Eye Clinic London."
      />
      <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <ul className="divide-y" style={{ borderColor: COLOR.border }}>
          {mine.length === 0 && (
            <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No notifications yet.</li>
          )}
          {mine.map((r, i) => (
            <li key={r.id || i} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.primaryTint, color: COLOR.secondary }}>
                <Bell size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.patient} · {r.treatment}</p>
                <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>Updated {r.date}</p>
              </div>
              <Pill tone={STATUS_TONE[r.status] || 'default'}>{r.status}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
