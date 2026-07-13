'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { COLOR } from '@/lib/theme';
import { Select } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal';
import { FEE_STATUSES, FEE_STATUS_LABELS, JOURNEY_STATUSES, JOURNEY_STATUS_LABELS, REFERRAL_OUTCOMES, REFERRAL_OUTCOME_LABELS, type FeeStatus, type JourneyStatus, type Referral, type ReferralOutcome } from '@/types/referral';
import { updateFeeStatusAction, updateReferralStatusAction } from '@/lib/actions/referral-actions';

export function ReferralDetailControls({ referral }: { referral: Referral }) {
  const router = useRouter();
  const [pendingClose, setPendingClose] = useState(false);
  const [outcome, setOutcome] = useState<ReferralOutcome | ''>('');
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: JourneyStatus) {
    if (next === 'closed') {
      setPendingClose(true);
      setOutcome('');
      return;
    }
    startTransition(async () => {
      await updateReferralStatusAction(referral.id, next, null);
      router.refresh();
    });
  }

  function confirmClose() {
    if (!outcome) return;
    startTransition(async () => {
      await updateReferralStatusAction(referral.id, 'closed', outcome);
      setPendingClose(false);
      router.refresh();
    });
  }

  function handleFeeChange(next: FeeStatus) {
    startTransition(async () => {
      await updateFeeStatusAction(referral.id, next);
      router.refresh();
    });
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
        Manage referral
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: COLOR.textMuted }}>
            Journey status
          </label>
          <Select value={referral.journeyStatus} disabled={isPending} onChange={(e) => handleStatusChange(e.target.value as JourneyStatus)}>
            {JOURNEY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {JOURNEY_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: COLOR.textMuted }}>
            Fee status
          </label>
          <Select value={referral.feeStatus} disabled={isPending} onChange={(e) => handleFeeChange(e.target.value as FeeStatus)}>
            {FEE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {FEE_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Modal open={pendingClose} onClose={() => setPendingClose(false)}>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', color: COLOR.text }}>Close referral</h3>
        <p className="mt-1 text-sm" style={{ color: COLOR.textMuted }}>
          Record why this referral is closing. This does not automatically count as &ldquo;lost&rdquo;.
        </p>
        <div className="mt-4 space-y-2">
          {REFERRAL_OUTCOMES.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-3 text-sm" style={{ background: outcome === o ? COLOR.primaryTint : COLOR.recessed, border: `1px solid ${outcome === o ? COLOR.primary : 'transparent'}` }}>
              <input type="radio" name="outcome" checked={outcome === o} onChange={() => setOutcome(o)} />
              {REFERRAL_OUTCOME_LABELS[o]}
            </label>
          ))}
        </div>
        <button onClick={confirmClose} disabled={!outcome || isPending} className="ecl-btn ecl-press mt-5 w-full rounded-lg py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary, opacity: !outcome || isPending ? 0.6 : 1 }}>
          Confirm close
        </button>
      </Modal>
    </div>
  );
}
