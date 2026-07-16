import { useState } from 'react';
import { useColors } from '../../theme/colors';
import { Pill } from '../../components/shared/Pill';

export function PrioritiesSection({ referrals }) {
  const COLOR = useColors();
  const [showAll, setShowAll] = useState(false);
  const feesOutstanding = referrals.filter((r) => r.status !== 'Treatment Completed' && r.status !== 'Closed').reduce((s, r) => s + r.fee, 0);
  const bookedNotAttended = referrals.filter((r) => r.status === 'Consultation Booked').length;
  const awaiting = referrals.filter((r) => r.status === 'Awaiting Consultation' || r.status === 'Referral Received').length;

  const priorities = [
    { level: 'High priority', tone: 'problem', text: `£${feesOutstanding.toLocaleString()} referral fees outstanding. Review unpaid partner fees.` },
    { level: 'Medium', tone: 'action', text: `${bookedNotAttended} patient${bookedNotAttended !== 1 ? 's' : ''} booked but not yet attended. Follow up to reduce drop-off.` },
    { level: 'Medium', tone: 'action', text: 'Referral → treatment conversion down slightly this month vs last — worth reviewing the funnel.' },
    { level: 'Low', tone: 'default', text: `${awaiting} referral${awaiting !== 1 ? 's' : ''} awaiting first consultation booking.` },
    { level: 'Low', tone: 'default', text: 'Two partner practices have not referred in over 30 days — consider a check-in call.' },
  ];
  const visible = showAll ? priorities : priorities.slice(0, 3);
  const borderColor = { problem: COLOR.problem, action: COLOR.accent, default: COLOR.border };

  return (
    <div className="ecl-fade-up mt-6">
      <h2 className="mb-3 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
        <span style={{ fontSize: 16 }}>◎</span> Today's priorities
      </h2>
      <div className="space-y-3">
        {visible.map((p, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ background: COLOR.bg, borderLeft: `4px solid ${borderColor[p.tone]}`, border: `1px solid ${COLOR.border}`, borderLeftWidth: 4, borderLeftColor: borderColor[p.tone] }}
          >
            <Pill tone={p.tone === 'problem' ? 'action' : p.tone === 'action' ? 'accent' : 'default'}>{p.level}</Pill>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.text }}>{p.text}</p>
          </div>
        ))}
      </div>
      {!showAll && priorities.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="ecl-btn mt-3 w-full rounded-xl py-2.5 text-sm font-medium"
          style={{ border: `1px dashed ${COLOR.accent}`, color: COLOR.accent, background: 'transparent' }}
        >
          Show all {priorities.length} priorities
        </button>
      )}
    </div>
  );
}
