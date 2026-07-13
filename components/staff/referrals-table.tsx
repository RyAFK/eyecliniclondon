'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ClipboardList, Search } from 'lucide-react';
import { COLOR, toneBg, toneColor } from '@/lib/theme';
import { Select } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal';
import { JOURNEY_STATUSES, JOURNEY_STATUS_LABELS, REFERRAL_OUTCOMES, REFERRAL_OUTCOME_LABELS, treatmentName, type JourneyStatus, type Referral, type ReferralOutcome } from '@/types/referral';
import { STATUS_TONE } from '@/components/referrals/status-badge';
import { updateReferralStatusAction } from '@/lib/actions/referral-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ReferralsTable({ referrals }: { referrals: Referral[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JourneyStatus | 'all'>('all');
  const [expanded, setExpanded] = useState(false);
  const [pendingClose, setPendingClose] = useState<Referral | null>(null);
  const [outcome, setOutcome] = useState<ReferralOutcome | ''>('');
  const [isPending, startTransition] = useTransition();

  const filtered = referrals.filter((r) => {
    const matchesQuery = `${r.patientFirstName} ${r.patientLastName} ${r.practiceName} ${treatmentName(r.treatmentType)}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.journeyStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const visible = expanded ? filtered : filtered.slice(0, 8);

  function handleStatusChange(referral: Referral, next: JourneyStatus) {
    if (next === 'closed') {
      setPendingClose(referral);
      setOutcome('');
      return;
    }
    startTransition(async () => {
      await updateReferralStatusAction(referral.id, next, null);
      router.refresh();
    });
  }

  function confirmClose() {
    if (!pendingClose || !outcome) return;
    startTransition(async () => {
      await updateReferralStatusAction(pendingClose.id, 'closed', outcome);
      setPendingClose(null);
      router.refresh();
    });
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
          <ClipboardList size={16} style={{ color: COLOR.secondary }} /> All referrals
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR.textMuted }} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExpanded(false);
              }}
              placeholder="Search patient or practice"
              style={{ paddingLeft: '2rem', fontSize: '13px', borderRadius: '0.625rem', border: `1px solid ${COLOR.border}`, background: COLOR.bg, padding: '0.625rem 0.875rem 0.625rem 2rem', color: COLOR.text, outline: 'none' }}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as JourneyStatus | 'all');
              setExpanded(false);
            }}
            style={{ fontSize: '13px' }}
          >
            <option value="all">All statuses</option>
            {JOURNEY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {JOURNEY_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <ul className="mt-4 divide-y" style={{ borderColor: COLOR.border }}>
        {filtered.length === 0 && <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No referrals match your search.</li>}
        {visible.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: COLOR.border }}>
            <Link href={`/staff/referrals/${r.id}`} className="min-w-0">
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                {r.patientFirstName} {r.patientLastName.charAt(0)}. · {treatmentName(r.treatmentType)}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
                <Building2 size={12} /> {r.practiceName} · {formatDate(r.createdAt)} · {formatCurrency(r.feeAmount)}
              </p>
            </Link>
            <Select
              value={r.journeyStatus}
              disabled={isPending}
              onChange={(e) => handleStatusChange(r, e.target.value as JourneyStatus)}
              className="shrink-0 rounded-full text-xs font-medium"
              style={{ background: toneBg(STATUS_TONE[r.journeyStatus]), color: toneColor(STATUS_TONE[r.journeyStatus]), border: 'none', padding: '0.25rem 0.625rem', width: 'auto' }}
            >
              {JOURNEY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {JOURNEY_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </li>
        ))}
      </ul>

      {!expanded && filtered.length > 8 && (
        <button onClick={() => setExpanded(true)} className="ecl-btn ecl-press mt-4 w-full rounded-lg py-2.5 text-sm font-medium" style={{ background: COLOR.recessed, color: COLOR.text, border: `1px solid ${COLOR.border}` }}>
          Show all {filtered.length} referrals
        </button>
      )}

      <Modal open={!!pendingClose} onClose={() => setPendingClose(null)}>
        {pendingClose && (
          <>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', color: COLOR.text }}>Close referral</h3>
            <p className="mt-1 text-sm" style={{ color: COLOR.textMuted }}>
              {pendingClose.patientFirstName} {pendingClose.patientLastName.charAt(0)}. — record why this referral is closing. This does not automatically count as &ldquo;lost&rdquo;.
            </p>
            <div className="mt-4 space-y-2">
              {REFERRAL_OUTCOMES.map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-3 text-sm" style={{ background: outcome === o ? COLOR.primaryTint : COLOR.recessed, border: `1px solid ${outcome === o ? COLOR.primary : 'transparent'}` }}>
                  <input type="radio" name="outcome" checked={outcome === o} onChange={() => setOutcome(o)} />
                  {REFERRAL_OUTCOME_LABELS[o]}
                </label>
              ))}
            </div>
            <button
              onClick={confirmClose}
              disabled={!outcome || isPending}
              className="ecl-btn ecl-press mt-5 w-full rounded-lg py-2.5 text-sm font-medium text-white"
              style={{ background: COLOR.primary, opacity: !outcome || isPending ? 0.6 : 1 }}
            >
              Confirm close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
