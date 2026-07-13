import { Check, Circle } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { JOURNEY_STATUS_LABELS, REFERRAL_OUTCOME_LABELS, type ReferralStatusHistoryEntry } from '@/types/referral';
import { formatDateTime } from '@/lib/utils';

/** Visual patient journey timeline — the append-only history from referral_status_history, rendered chronologically. */
export function JourneyTimeline({ history }: { history: ReferralStatusHistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <p className="rounded-xl p-4 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
        No journey history yet.
      </p>
    );
  }

  return (
    <ol className="relative ml-3 space-y-6 border-l pl-6" style={{ borderColor: COLOR.border }}>
      {history.map((entry, i) => {
        const isLast = i === history.length - 1;
        return (
          <li key={entry.id} className="relative">
            <span
              className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: isLast ? COLOR.accent : COLOR.primary, color: '#fff', boxShadow: `0 0 0 4px ${COLOR.bg}` }}
            >
              {isLast ? <Circle size={11} fill="#fff" /> : <Check size={12} />}
            </span>
            <p className="text-sm font-medium" style={{ color: COLOR.text }}>
              {JOURNEY_STATUS_LABELS[entry.toStatus]}
              {entry.outcome && <span style={{ color: COLOR.textMuted, fontWeight: 400 }}> — {REFERRAL_OUTCOME_LABELS[entry.outcome]}</span>}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
              {formatDateTime(entry.changedAt)} · {entry.changedByName}
            </p>
            {entry.note && (
              <p className="mt-1.5 rounded-lg p-2.5 text-xs" style={{ background: COLOR.recessed, color: COLOR.text }}>
                {entry.note}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
