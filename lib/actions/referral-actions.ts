'use server';

import { revalidatePath } from 'next/cache';
import { requirePartner, requireStaff } from '@/lib/auth';
import { referralsService } from '@/services';
import type { ReferralSubmission, FeeStatus, JourneyStatus, ReferralOutcome, Referral } from '@/types/referral';

export interface SubmitReferralResult {
  referral?: Referral;
  error?: string;
}

/** Called directly from the client wizard (not a <form action>) — practiceId is forced server-side, never trusted from the client payload. */
export async function submitReferralAction(input: Omit<ReferralSubmission, 'practiceId'>): Promise<SubmitReferralResult> {
  const user = await requirePartner();
  try {
    const referral = await referralsService.createReferral(user, { ...input, practiceId: user.practiceId! });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/referrals');
    revalidatePath('/staff');
    revalidatePath('/staff/referrals');
    return { referral };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not submit this referral. Please try again.' };
  }
}

export async function updateReferralStatusAction(
  referralId: string,
  toStatus: JourneyStatus,
  outcome: ReferralOutcome | null,
  note?: string
): Promise<{ error?: string }> {
  const user = await requireStaff();
  try {
    await referralsService.updateReferralStatus(user, { referralId, toStatus, outcome, note });
    revalidatePath('/staff/referrals');
    revalidatePath(`/staff/referrals/${referralId}`);
    revalidatePath('/staff');
    revalidatePath('/dashboard/referrals');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not update referral status.' };
  }
}

export async function updateFeeStatusAction(referralId: string, feeStatus: FeeStatus): Promise<{ error?: string }> {
  const user = await requireStaff();
  try {
    await referralsService.updateFeeStatus(user, referralId, feeStatus);
    revalidatePath('/staff/fees');
    revalidatePath(`/staff/referrals/${referralId}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not update fee status.' };
  }
}
