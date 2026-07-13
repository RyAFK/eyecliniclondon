'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COLOR, toneBg, toneColor, type Tone } from '@/lib/theme';
import { Select } from '@/components/ui/inputs';
import { FEE_STATUSES, FEE_STATUS_LABELS, treatmentName, type FeeStatus, type Referral } from '@/types/referral';
import { updateFeeStatusAction } from '@/lib/actions/referral-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

const FEE_TONE: Record<FeeStatus, Tone> = { not_eligible: 'closed', pending: 'action', invoiced: 'info', paid: 'complete' };

export function FeesTable({ referrals }: { referrals: Referral[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FeeStatus | 'all'>('all');
  const [isPending, startTransition] = useTransition();

  const eligible = referrals.filter((r) => r.feeStatus !== 'not_eligible' || filter === 'not_eligible' || filter === 'all');
  const filtered = filter === 'all' ? eligible : eligible.filter((r) => r.feeStatus === filter);

  function handleChange(referral: Referral, next: FeeStatus) {
    startTransition(async () => {
      await updateFeeStatusAction(referral.id, next);
      router.refresh();
    });
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-medium" style={{ color: COLOR.text }}>
          Referral fees
        </h2>
        <Select value={filter} onChange={(e) => setFilter(e.target.value as FeeStatus | 'all')} style={{ fontSize: '13px', width: 'auto' }}>
          <option value="all">All fee-eligible</option>
          {FEE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {FEE_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>
      <ul className="divide-y" style={{ borderColor: COLOR.border }}>
        {filtered.length === 0 && <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No referrals match this filter.</li>}
        {filtered.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <Link href={`/staff/referrals/${r.id}`} className="min-w-0">
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                {r.patientFirstName} {r.patientLastName.charAt(0)}. · {treatmentName(r.treatmentType)}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                {r.practiceName} · {formatDate(r.createdAt)} · {formatCurrency(r.feeAmount)}
              </p>
            </Link>
            <Select
              value={r.feeStatus}
              disabled={isPending}
              onChange={(e) => handleChange(r, e.target.value as FeeStatus)}
              className="shrink-0 rounded-full text-xs font-medium"
              style={{ background: toneBg(FEE_TONE[r.feeStatus]), color: toneColor(FEE_TONE[r.feeStatus]), border: 'none', padding: '0.25rem 0.625rem', width: 'auto' }}
            >
              {FEE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {FEE_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </li>
        ))}
      </ul>
    </div>
  );
}
