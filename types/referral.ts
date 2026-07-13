export const TREATMENT_TYPES = [
  { id: 'cataract', name: 'Cataract', description: 'Lens replacement for cataracts' },
  { id: 'rle', name: 'Refractive Lens Exchange', description: 'Lens exchange for refractive correction' },
  { id: 'icl', name: 'Implantable Contact Lens / ICL', description: 'Phakic lens implantation' },
  { id: 'lvc', name: 'Laser Vision Correction', description: 'LASIK / PRK / SMILE' },
  { id: 'cornea', name: 'Cornea', description: 'Corneal conditions and transplant' },
  { id: 'dry_eye', name: 'Dry Eye', description: 'Dry eye assessment and management' },
  { id: 'general', name: 'General Ophthalmology', description: 'General ophthalmic assessment' },
  { id: 'other', name: 'Other', description: 'Any other treatment enquiry' },
] as const;

export type TreatmentTypeId = (typeof TREATMENT_TYPES)[number]['id'];

export const TREATMENT_FEE_MAP: Record<TreatmentTypeId, number> = {
  cataract: 150,
  rle: 180,
  icl: 200,
  lvc: 200,
  cornea: 120,
  dry_eye: 80,
  general: 90,
  other: 100,
};

export function treatmentName(id: TreatmentTypeId | string): string {
  return TREATMENT_TYPES.find((t) => t.id === id)?.name ?? id;
}

/**
 * Journey status = "where is this referral in the clinic pipeline right now".
 * This is intentionally a SEPARATE field from `outcome` below. A referral's
 * journey always ends at `closed`, but *why* it closed (successful treatment,
 * patient declined, DNA, clinically unsuitable, referred elsewhere...) is
 * captured by `outcome`, not implied by the journey status. This prevents the
 * common bug of "every closed referral counted as lost".
 */
export const JOURNEY_STATUSES = [
  'referral_received',
  'awaiting_consultation',
  'consultation_booked',
  'treatment_recommended',
  'treatment_booked',
  'treatment_completed',
  'closed',
] as const;

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number];

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  referral_received: 'Referral Received',
  awaiting_consultation: 'Awaiting Consultation',
  consultation_booked: 'Consultation Booked',
  treatment_recommended: 'Treatment Recommended',
  treatment_booked: 'Treatment Booked',
  treatment_completed: 'Treatment Completed',
  closed: 'Closed',
};

/** Rank used for funnel / conversion calculations — NOT for display. */
export const JOURNEY_STATUS_RANK: Record<JourneyStatus, number> = {
  referral_received: 0,
  awaiting_consultation: 0,
  consultation_booked: 1,
  treatment_recommended: 1,
  treatment_booked: 2,
  treatment_completed: 3,
  closed: 3,
};

/**
 * Outcome is only ever set once a referral reaches `closed`. It answers
 * "how did this referral end", independent of the pipeline stage it reached.
 * `null` means the referral is still open (any non-closed journey status).
 */
export const REFERRAL_OUTCOMES = [
  'treatment_successful',
  'ongoing_care',
  'patient_declined',
  'did_not_attend',
  'clinically_unsuitable',
  'referred_elsewhere',
  'other',
] as const;

export type ReferralOutcome = (typeof REFERRAL_OUTCOMES)[number];

export const REFERRAL_OUTCOME_LABELS: Record<ReferralOutcome, string> = {
  treatment_successful: 'Treatment successful',
  ongoing_care: 'Ongoing care',
  patient_declined: 'Patient declined to proceed',
  did_not_attend: 'Did not attend',
  clinically_unsuitable: 'Clinically unsuitable',
  referred_elsewhere: 'Referred elsewhere',
  other: 'Other',
};

/** Outcomes that should NOT be counted as "lost" in reporting. */
export const POSITIVE_OUTCOMES: ReferralOutcome[] = ['treatment_successful', 'ongoing_care'];

export const PREFERRED_CONTACT_METHODS = ['phone', 'email', 'either'] as const;
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

export const FEE_STATUSES = ['not_eligible', 'pending', 'invoiced', 'paid'] as const;
export type FeeStatus = (typeof FEE_STATUSES)[number];

export const FEE_STATUS_LABELS: Record<FeeStatus, string> = {
  not_eligible: 'Not eligible',
  pending: 'Pending',
  invoiced: 'Invoiced',
  paid: 'Paid',
};

/** Canonical referral record — the single source of truth every dashboard reads from. */
export interface Referral {
  id: string;
  /** Server-generated, e.g. "ECL-2026-000123". Never set by the client. */
  reference: string;

  /** Immutable FK — the actual access-control boundary, not `practiceName`. */
  practiceId: string;
  /** Denormalised for display only; never used for authorization checks. */
  practiceName: string;

  createdByUserId: string;

  patientFirstName: string;
  patientLastName: string;
  patientDob: string;
  patientPhone: string;
  patientEmail: string | null;
  preferredContactMethod: PreferredContactMethod;
  /** Defaults to false everywhere in the app — must be explicitly confirmed by the referrer. */
  patientConsent: boolean;
  consentConfirmedAt: string | null;

  treatmentType: TreatmentTypeId;
  referralReason: string | null;
  presentingSymptoms: string | null;
  unaidedVisualAcuity: string | null;
  bestCorrectedVisualAcuity: string | null;

  journeyStatus: JourneyStatus;
  outcome: ReferralOutcome | null;

  feeAmount: number;
  feeStatus: FeeStatus;

  createdAt: string;
  updatedAt: string;
}

export interface ReferralStatusHistoryEntry {
  id: string;
  referralId: string;
  fromStatus: JourneyStatus | null;
  toStatus: JourneyStatus;
  outcome: ReferralOutcome | null;
  note: string | null;
  changedByUserId: string;
  changedByName: string;
  changedAt: string;
}

export interface ReferralDocument {
  id: string;
  referralId: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedByUserId: string;
  uploadedAt: string;
}

/** Payload accepted when a partner submits the referral wizard. Server assigns id/reference/timestamps. */
export interface ReferralSubmission {
  practiceId: string;
  patientFirstName: string;
  patientLastName: string;
  patientDob: string;
  patientPhone: string;
  patientEmail: string | null;
  preferredContactMethod: PreferredContactMethod;
  patientConsent: boolean;
  treatmentType: TreatmentTypeId;
  referralReason: string | null;
  presentingSymptoms: string | null;
  unaidedVisualAcuity: string | null;
  bestCorrectedVisualAcuity: string | null;
}
