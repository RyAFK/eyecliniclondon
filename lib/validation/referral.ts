import { z } from 'zod';
import { JOURNEY_STATUSES, PREFERRED_CONTACT_METHODS, REFERRAL_OUTCOMES, REFERRAL_SOURCES, TREATMENT_TYPES } from '@/types/referral';

const treatmentIds = TREATMENT_TYPES.map((t) => t.id) as [string, ...string[]];

const ukPhone = /^[0-9+()\s-]{7,20}$/;

export const patientDetailsSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date')
    .refine((v) => new Date(v) <= new Date(), 'Date of birth cannot be in the future'),
  phone: z.string().trim().min(1, 'Telephone number is required').regex(ukPhone, 'Enter a valid telephone number'),
  email: z.union([z.string().trim().email('Enter a valid email address'), z.literal('')]).nullable().optional(),
  contactMethod: z.enum(PREFERRED_CONTACT_METHODS),
  /**
   * Consent has NO default here on purpose — the wizard state seeds this at
   * `false` and the schema requires it to be explicitly `true` before the
   * patient-details step can be completed. Never default this to true.
   */
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Patient consent must be confirmed before continuing.' }),
  }),
});

export const clinicalInfoSchema = z.object({
  reason: z.string().trim().max(2000).optional().default(''),
  symptoms: z.string().trim().max(2000).optional().default(''),
  unaidedVisualAcuity: z.string().trim().max(50).optional().default(''),
  bestCorrectedVisualAcuity: z.string().trim().max(50).optional().default(''),
});

export const referralTypeSchema = z.object({
  treatmentType: z.enum(treatmentIds, { errorMap: () => ({ message: 'Select a treatment category to continue.' }) }),
});

/** Full payload validated server-side before a referral row is written. */
export const referralSubmissionSchema = z.object({
  practiceId: z.string().uuid('Invalid practice'),
  patientFirstName: patientDetailsSchema.shape.firstName,
  patientLastName: patientDetailsSchema.shape.lastName,
  patientDob: patientDetailsSchema.shape.dob,
  patientPhone: patientDetailsSchema.shape.phone,
  patientEmail: z.string().trim().email().nullable(),
  preferredContactMethod: z.enum(PREFERRED_CONTACT_METHODS),
  patientConsent: z.literal(true, {
    errorMap: () => ({ message: 'Patient consent must be confirmed before a referral can be submitted.' }),
  }),
  treatmentType: z.enum(treatmentIds),
  referralReason: z.string().trim().max(2000).nullable(),
  presentingSymptoms: z.string().trim().max(2000).nullable(),
  unaidedVisualAcuity: z.string().trim().max(50).nullable(),
  bestCorrectedVisualAcuity: z.string().trim().max(50).nullable(),
  source: z.enum(REFERRAL_SOURCES).optional().default('direct'),
});

export type ReferralSubmissionInput = z.infer<typeof referralSubmissionSchema>;

export const documentUploadSchema = z.object({
  referralId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/heic']),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024, 'Files must be 25MB or smaller'),
});

export const statusChangeSchema = z
  .object({
    referralId: z.string().uuid(),
    toStatus: z.enum(JOURNEY_STATUSES),
    outcome: z.enum(REFERRAL_OUTCOMES).nullable().optional(),
    note: z.string().trim().max(1000).optional(),
  })
  .refine((data) => data.toStatus !== 'closed' || !!data.outcome, {
    message: 'An outcome must be recorded when closing a referral.',
    path: ['outcome'],
  });
