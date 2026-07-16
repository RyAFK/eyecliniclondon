import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { getDemoStore, nextDemoReference } from '@/lib/demo/store';
import { DEMO_PRACTICES, DEMO_USERS } from '@/lib/demo/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canAccessPractice } from '@/lib/auth';
import { referralSubmissionSchema, statusChangeSchema } from '@/lib/validation/referral';
import { isStaffRole, type UserProfile } from '@/types/user';
import {
  TREATMENT_FEE_MAP,
  type FeeStatus,
  type JourneyStatus,
  type Referral,
  type ReferralOutcome,
  type ReferralStatusHistoryEntry,
  type ReferralSubmission,
} from '@/types/referral';
import type { Database } from '@/types/database';

type ReferralRow = Database['public']['Tables']['referrals']['Row'];

function mapRow(row: ReferralRow, practiceName: string): Referral {
  return {
    id: row.id,
    reference: row.reference,
    practiceId: row.practice_id,
    practiceName,
    createdByUserId: row.created_by_user_id,
    patientFirstName: row.patient_first_name,
    patientLastName: row.patient_last_name,
    patientDob: row.patient_dob,
    patientPhone: row.patient_phone,
    patientEmail: row.patient_email,
    preferredContactMethod: row.preferred_contact_method,
    patientConsent: row.patient_consent,
    consentConfirmedAt: row.consent_confirmed_at,
    treatmentType: row.treatment_type as Referral['treatmentType'],
    referralReason: row.referral_reason,
    presentingSymptoms: row.presenting_symptoms,
    unaidedVisualAcuity: row.unaided_visual_acuity,
    bestCorrectedVisualAcuity: row.best_corrected_visual_acuity,
    source: (row.source as Referral['source']) ?? 'direct',
    journeyStatus: row.journey_status as JourneyStatus,
    outcome: row.outcome as ReferralOutcome | null,
    feeAmount: Number(row.fee_amount),
    feeStatus: row.fee_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Scopes a referral list to what `user` is allowed to see — the single choke point every list view goes through. */
export async function listReferrals(user: UserProfile, opts: { practiceId?: string } = {}): Promise<Referral[]> {
  const staff = isStaffRole(user.role);

  if (isDemoMode()) {
    const store = getDemoStore();
    let rows = store.referrals;
    if (!staff) rows = rows.filter((r) => r.practiceId === user.practiceId);
    if (opts.practiceId) rows = rows.filter((r) => r.practiceId === opts.practiceId);
    return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = createServerSupabaseClient();
  let query = supabase.from('referrals').select('*, practices(name)').order('created_at', { ascending: false });
  if (!staff) query = query.eq('practice_id', user.practiceId ?? '');
  if (opts.practiceId) query = query.eq('practice_id', opts.practiceId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row: any) => mapRow(row, row.practices?.name ?? ''));
}

export async function getReferral(user: UserProfile, id: string): Promise<Referral | null> {
  if (isDemoMode()) {
    const referral = getDemoStore().referrals.find((r) => r.id === id);
    if (!referral) return null;
    if (!canAccessPractice(user, referral.practiceId)) return null;
    return referral;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('referrals').select('*, practices(name)').eq('id', id).single();
  if (error || !data) return null;
  const row = data as any;
  if (!canAccessPractice(user, row.practice_id)) return null;
  return mapRow(row, row.practices?.name ?? '');
}

export async function getStatusHistory(user: UserProfile, referralId: string): Promise<ReferralStatusHistoryEntry[]> {
  if (isDemoMode()) {
    const store = getDemoStore();
    const referral = store.referrals.find((r) => r.id === referralId);
    if (!referral || !canAccessPractice(user, referral.practiceId)) return [];
    return store.statusHistory
      .filter((h) => h.referralId === referralId)
      .sort((a, b) => a.changedAt.localeCompare(b.changedAt));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referral_status_history')
    .select('*, profiles(full_name)')
    .eq('referral_id', referralId)
    .order('changed_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    referralId: row.referral_id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    outcome: row.outcome,
    note: row.note,
    changedByUserId: row.changed_by_user_id,
    changedByName: row.profiles?.full_name ?? 'Unknown',
    changedAt: row.changed_at,
  }));
}

/** Creates a referral. Reference is always server-generated — never accepted from the client. */
export async function createReferral(user: UserProfile, submission: ReferralSubmission): Promise<Referral> {
  const parsed = referralSubmissionSchema.parse(submission);

  if (!canAccessPractice(user, parsed.practiceId)) {
    throw new Error('You do not have permission to refer a patient for this practice.');
  }

  const feeAmount = TREATMENT_FEE_MAP[parsed.treatmentType as keyof typeof TREATMENT_FEE_MAP] ?? 0;
  const now = new Date().toISOString();

  if (isDemoMode()) {
    const store = getDemoStore();
    const practice = DEMO_PRACTICES.find((p) => p.id === parsed.practiceId);
    const referral: Referral = {
      id: crypto.randomUUID(),
      reference: nextDemoReference(),
      practiceId: parsed.practiceId,
      practiceName: practice?.name ?? 'Unknown practice',
      createdByUserId: user.id,
      patientFirstName: parsed.patientFirstName,
      patientLastName: parsed.patientLastName,
      patientDob: parsed.patientDob,
      patientPhone: parsed.patientPhone,
      patientEmail: parsed.patientEmail,
      preferredContactMethod: parsed.preferredContactMethod,
      patientConsent: parsed.patientConsent,
      consentConfirmedAt: now,
      treatmentType: parsed.treatmentType as Referral['treatmentType'],
      referralReason: parsed.referralReason,
      presentingSymptoms: parsed.presentingSymptoms,
      unaidedVisualAcuity: parsed.unaidedVisualAcuity,
      bestCorrectedVisualAcuity: parsed.bestCorrectedVisualAcuity,
      source: parsed.source,
      journeyStatus: 'referral_received',
      outcome: null,
      feeAmount,
      feeStatus: feeAmount > 0 ? 'pending' : 'not_eligible',
      createdAt: now,
      updatedAt: now,
    };
    store.referrals.unshift(referral);
    store.statusHistory.push({
      id: crypto.randomUUID(),
      referralId: referral.id,
      fromStatus: null,
      toStatus: 'referral_received',
      outcome: null,
      note: 'Referral submitted by practice.',
      changedByUserId: user.id,
      changedByName: user.fullName,
      changedAt: now,
    });
    store.auditLog.push({
      id: crypto.randomUUID(),
      actorUserId: user.id,
      actorName: user.fullName,
      action: 'referral.created',
      entityType: 'referral',
      entityId: referral.id,
      practiceId: referral.practiceId,
      metadata: { reference: referral.reference, treatmentType: referral.treatmentType },
      createdAt: now,
    });
    // Notify ECL staff a new referral has arrived.
    DEMO_USERS.filter((u) => isStaffRole(u.role)).forEach((staffUser) => {
      store.notifications.unshift({
        id: crypto.randomUUID(),
        userId: staffUser.id,
        type: 'referral_received',
        title: 'New referral received',
        body: `${referral.patientFirstName} ${referral.patientLastName.charAt(0)}. — ${referral.practiceName}`,
        referralId: referral.id,
        read: false,
        createdAt: now,
      });
    });
    return referral;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      practice_id: parsed.practiceId,
      created_by_user_id: user.id,
      patient_first_name: parsed.patientFirstName,
      patient_last_name: parsed.patientLastName,
      patient_dob: parsed.patientDob,
      patient_phone: parsed.patientPhone,
      patient_email: parsed.patientEmail,
      preferred_contact_method: parsed.preferredContactMethod,
      patient_consent: parsed.patientConsent,
      treatment_type: parsed.treatmentType,
      referral_reason: parsed.referralReason,
      presenting_symptoms: parsed.presentingSymptoms,
      unaided_visual_acuity: parsed.unaidedVisualAcuity,
      best_corrected_visual_acuity: parsed.bestCorrectedVisualAcuity,
      source: parsed.source,
      fee_amount: feeAmount,
      fee_status: feeAmount > 0 ? 'pending' : 'not_eligible',
      // reference, journey_status, outcome are all server-defaulted / trigger-generated.
    })
    .select('*, practices(name)')
    .single();

  if (error) throw error;
  return mapRow(data as any, (data as any).practices?.name ?? '');
}

interface StatusChangeInput {
  referralId: string;
  toStatus: JourneyStatus;
  outcome?: ReferralOutcome | null;
  note?: string;
}

/** Staff-only: moves a referral's journey status and, if closing it, records why (the outcome). */
export async function updateReferralStatus(user: UserProfile, input: StatusChangeInput): Promise<Referral> {
  if (!isStaffRole(user.role)) throw new Error('Only Eye Clinic London staff can update referral status.');
  const parsed = statusChangeSchema.parse(input);

  if (isDemoMode()) {
    const store = getDemoStore();
    const referral = store.referrals.find((r) => r.id === parsed.referralId);
    if (!referral) throw new Error('Referral not found.');
    const now = new Date().toISOString();
    const fromStatus = referral.journeyStatus;
    referral.journeyStatus = parsed.toStatus;
    referral.outcome = parsed.toStatus === 'closed' ? parsed.outcome ?? null : null;
    referral.updatedAt = now;

    store.statusHistory.push({
      id: crypto.randomUUID(),
      referralId: referral.id,
      fromStatus,
      toStatus: parsed.toStatus,
      outcome: referral.outcome,
      note: parsed.note ?? null,
      changedByUserId: user.id,
      changedByName: user.fullName,
      changedAt: now,
    });
    store.auditLog.push({
      id: crypto.randomUUID(),
      actorUserId: user.id,
      actorName: user.fullName,
      action: 'referral.status_changed',
      entityType: 'referral',
      entityId: referral.id,
      practiceId: referral.practiceId,
      metadata: { fromStatus, toStatus: parsed.toStatus, outcome: referral.outcome },
      createdAt: now,
    });

    const practiceUsers = DEMO_USERS.filter((u) => u.practiceId === referral.practiceId);
    practiceUsers.forEach((practiceUser) => {
      store.notifications.unshift({
        id: crypto.randomUUID(),
        userId: practiceUser.id,
        type: 'referral_status_change',
        title: parsed.toStatus === 'closed' ? 'Referral closed' : 'Referral status updated',
        body: `${referral.patientFirstName} ${referral.patientLastName.charAt(0)}. — now ${parsed.toStatus.replace(/_/g, ' ')}`,
        referralId: referral.id,
        read: false,
        createdAt: now,
      });
    });

    return referral;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referrals')
    .update({ journey_status: parsed.toStatus, outcome: parsed.toStatus === 'closed' ? parsed.outcome : null })
    .eq('id', parsed.referralId)
    .select('*, practices(name)')
    .single();

  if (error) throw error;
  return mapRow(data as any, (data as any).practices?.name ?? '');
}

/** Staff-only: updates the fee status of a referral (pending -> invoiced -> paid). */
export async function updateFeeStatus(user: UserProfile, referralId: string, feeStatus: FeeStatus): Promise<Referral> {
  if (!isStaffRole(user.role)) throw new Error('Only Eye Clinic London staff can update fee status.');

  if (isDemoMode()) {
    const store = getDemoStore();
    const referral = store.referrals.find((r) => r.id === referralId);
    if (!referral) throw new Error('Referral not found.');
    const previous = referral.feeStatus;
    referral.feeStatus = feeStatus;
    referral.updatedAt = new Date().toISOString();
    store.auditLog.push({
      id: crypto.randomUUID(),
      actorUserId: user.id,
      actorName: user.fullName,
      action: 'fee.status_changed',
      entityType: 'referral',
      entityId: referral.id,
      practiceId: referral.practiceId,
      metadata: { fromStatus: previous, toStatus: feeStatus, feeAmount: referral.feeAmount },
      createdAt: referral.updatedAt,
    });
    return referral;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referrals')
    .update({ fee_status: feeStatus })
    .eq('id', referralId)
    .select('*, practices(name)')
    .single();

  if (error) throw error;
  return mapRow(data as any, (data as any).practices?.name ?? '');
}
