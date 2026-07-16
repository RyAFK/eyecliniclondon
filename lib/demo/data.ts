import type { Practice } from '@/types/practice';
import type { UserProfile } from '@/types/user';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/types/user';
import type { Referral, ReferralStatusHistoryEntry } from '@/types/referral';
import type { Task } from '@/types/task';
import type { Notification } from '@/types/notification';
import type { EducationResource } from '@/types/education';
import type { AuditLogEntry } from '@/types/audit';
import { TREATMENT_FEE_MAP, type TreatmentTypeId } from '@/types/referral';

/**
 * Entirely fictional demo dataset — no real patient data. Used only when
 * lib/demo/config.ts#isDemoMode() is true. Mirrors the shape (not the exact
 * rows) of supabase/seed.sql so the UI behaves the same way against either
 * data source.
 */

export const DEMO_PRACTICES: Practice[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    name: 'Keith Holland Opticians',
    addressLine1: '142 High Street',
    addressLine2: null,
    city: 'London',
    postcode: 'NW3 1AA',
    phone: '020 7946 0100',
    email: 'referrals@keithhollandopticians.co.uk',
    active: true,
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    name: 'Vision Plus Opticians',
    addressLine1: '58 Kensington Church Street',
    addressLine2: null,
    city: 'London',
    postcode: 'W8 4DP',
    phone: '020 7946 0200',
    email: 'admin@visionplusopticians.co.uk',
    active: true,
    createdAt: '2024-02-03T09:00:00.000Z',
    updatedAt: '2024-02-03T09:00:00.000Z',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000003',
    name: 'Marylebone Eyecare',
    addressLine1: '21 Marylebone Lane',
    addressLine2: null,
    city: 'London',
    postcode: 'W1U 2NT',
    phone: '020 7946 0300',
    email: 'hello@maryleboneeyecare.co.uk',
    active: true,
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000004',
    name: 'City Optical',
    addressLine1: '9 Moorgate',
    addressLine2: null,
    city: 'London',
    postcode: 'EC2R 6DA',
    phone: '020 7946 0400',
    email: 'referrals@cityoptical.co.uk',
    active: true,
    createdAt: '2024-04-22T09:00:00.000Z',
    updatedAt: '2024-04-22T09:00:00.000Z',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000005',
    name: 'ClearSight Chelsea',
    addressLine1: '77 Kings Road',
    addressLine2: null,
    city: 'London',
    postcode: 'SW3 4NX',
    phone: '020 7946 0500',
    email: 'team@clearsightchelsea.co.uk',
    active: true,
    createdAt: '2024-05-30T09:00:00.000Z',
    updatedAt: '2024-05-30T09:00:00.000Z',
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    email: 'jane.whitfield@keithhollandopticians.co.uk',
    fullName: 'Jane Whitfield',
    role: 'partner_admin',
    practiceId: DEMO_PRACTICES[0]!.id,
    active: true,
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    email: 'admin@visionplusopticians.co.uk',
    fullName: 'Priya Anand',
    role: 'partner_user',
    practiceId: DEMO_PRACTICES[1]!.id,
    active: true,
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    createdAt: '2024-02-04T09:00:00.000Z',
    updatedAt: '2024-02-04T09:00:00.000Z',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    email: 'ryan@eyecliniclondon.com',
    fullName: 'Ryan (Business Development)',
    role: 'ecl_admin',
    practiceId: null,
    active: true,
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    createdAt: '2023-11-01T09:00:00.000Z',
    updatedAt: '2023-11-01T09:00:00.000Z',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000004',
    email: 'clinic.coordinator@eyecliniclondon.com',
    fullName: 'Sophie Marchetti',
    role: 'ecl_staff',
    practiceId: null,
    active: true,
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    createdAt: '2023-11-05T09:00:00.000Z',
    updatedAt: '2023-11-05T09:00:00.000Z',
  },
];

interface SeedReferral {
  patientFirstName: string;
  patientLastNameInitial: string;
  practiceIndex: number;
  treatmentType: TreatmentTypeId;
  journeyStatus: Referral['journeyStatus'];
  outcome: Referral['outcome'];
  feeStatus: Referral['feeStatus'];
  daysAgo: number;
}

const SEED_ROWS: SeedReferral[] = [
  { patientFirstName: 'Sarah', patientLastNameInitial: 'Jennings', practiceIndex: 0, treatmentType: 'cataract', journeyStatus: 'consultation_booked', outcome: null, feeStatus: 'pending', daysAgo: 5 },
  { patientFirstName: 'Michael', patientLastNameInitial: 'Torres', practiceIndex: 0, treatmentType: 'icl', journeyStatus: 'treatment_recommended', outcome: null, feeStatus: 'pending', daysAgo: 8 },
  { patientFirstName: 'Priya', patientLastNameInitial: 'Khatri', practiceIndex: 0, treatmentType: 'dry_eye', journeyStatus: 'referral_received', outcome: null, feeStatus: 'not_eligible', daysAgo: 11 },
  { patientFirstName: 'David', patientLastNameInitial: 'Okafor', practiceIndex: 0, treatmentType: 'lvc', journeyStatus: 'treatment_completed', outcome: null, feeStatus: 'invoiced', daysAgo: 15 },
  { patientFirstName: 'Aisha', patientLastNameInitial: 'Rahman', practiceIndex: 1, treatmentType: 'general', journeyStatus: 'awaiting_consultation', outcome: null, feeStatus: 'not_eligible', daysAgo: 7 },
  { patientFirstName: 'Tom', patientLastNameInitial: 'Wu', practiceIndex: 2, treatmentType: 'cornea', journeyStatus: 'awaiting_consultation', outcome: null, feeStatus: 'not_eligible', daysAgo: 6 },
  { patientFirstName: 'Grace', patientLastNameInitial: 'Lindqvist', practiceIndex: 3, treatmentType: 'lvc', journeyStatus: 'consultation_booked', outcome: null, feeStatus: 'pending', daysAgo: 3 },
  { patientFirstName: 'Omar', patientLastNameInitial: 'Farouk', practiceIndex: 1, treatmentType: 'rle', journeyStatus: 'consultation_booked', outcome: null, feeStatus: 'pending', daysAgo: 2 },
  { patientFirstName: 'Helen', patientLastNameInitial: 'Sørensen', practiceIndex: 2, treatmentType: 'cataract', journeyStatus: 'treatment_booked', outcome: null, feeStatus: 'pending', daysAgo: 20 },
  { patientFirstName: 'Ruth', patientLastNameInitial: 'Abara', practiceIndex: 3, treatmentType: 'cataract', journeyStatus: 'closed', outcome: 'treatment_successful', feeStatus: 'paid', daysAgo: 40 },
  { patientFirstName: 'Daniel', patientLastNameInitial: 'Popescu', practiceIndex: 2, treatmentType: 'lvc', journeyStatus: 'treatment_booked', outcome: null, feeStatus: 'pending', daysAgo: 18 },
  { patientFirstName: 'Nadia', patientLastNameInitial: 'Haddad', practiceIndex: 1, treatmentType: 'dry_eye', journeyStatus: 'closed', outcome: 'treatment_successful', feeStatus: 'paid', daysAgo: 38 },
  { patientFirstName: 'Ben', patientLastNameInitial: 'Coleman', practiceIndex: 3, treatmentType: 'general', journeyStatus: 'closed', outcome: 'referred_elsewhere', feeStatus: 'not_eligible', daysAgo: 33 },
  { patientFirstName: 'James', patientLastNameInitial: 'Kowalski', practiceIndex: 4, treatmentType: 'dry_eye', journeyStatus: 'treatment_completed', outcome: null, feeStatus: 'invoiced', daysAgo: 23 },
  { patientFirstName: 'Linda', patientLastNameInitial: 'Marsh', practiceIndex: 0, treatmentType: 'cataract', journeyStatus: 'closed', outcome: 'treatment_successful', feeStatus: 'paid', daysAgo: 27 },
  { patientFirstName: 'Catherine', patientLastNameInitial: 'Hogan', practiceIndex: 4, treatmentType: 'lvc', journeyStatus: 'treatment_completed', outcome: null, feeStatus: 'invoiced', daysAgo: 12 },
  { patientFirstName: 'Newman', patientLastNameInitial: 'Osei', practiceIndex: 4, treatmentType: 'cataract', journeyStatus: 'closed', outcome: 'treatment_successful', feeStatus: 'paid', daysAgo: 45 },
  { patientFirstName: 'Betty', patientLastNameInitial: 'Alcock', practiceIndex: 0, treatmentType: 'general', journeyStatus: 'closed', outcome: 'treatment_successful', feeStatus: 'paid', daysAgo: 50 },
  { patientFirstName: 'Fatima', patientLastNameInitial: 'Siddiqui', practiceIndex: 2, treatmentType: 'dry_eye', journeyStatus: 'closed', outcome: 'did_not_attend', feeStatus: 'not_eligible', daysAgo: 30 },
  { patientFirstName: 'Peter', patientLastNameInitial: 'Vance', practiceIndex: 1, treatmentType: 'icl', journeyStatus: 'closed', outcome: 'patient_declined', feeStatus: 'not_eligible', daysAgo: 29 },
  { patientFirstName: 'Olivia', patientLastNameInitial: 'Bright', practiceIndex: 3, treatmentType: 'cornea', journeyStatus: 'closed', outcome: 'clinically_unsuitable', feeStatus: 'not_eligible', daysAgo: 35 },
  { patientFirstName: 'Chidi', patientLastNameInitial: 'Eze', practiceIndex: 4, treatmentType: 'rle', journeyStatus: 'awaiting_consultation', outcome: null, feeStatus: 'not_eligible', daysAgo: 4 },
  { patientFirstName: 'Isabelle', patientLastNameInitial: 'Farrow', practiceIndex: 0, treatmentType: 'general', journeyStatus: 'referral_received', outcome: null, feeStatus: 'not_eligible', daysAgo: 1 },
  { patientFirstName: 'Marcus', patientLastNameInitial: 'Lindberg', practiceIndex: 2, treatmentType: 'lvc', journeyStatus: 'treatment_recommended', outcome: null, feeStatus: 'pending', daysAgo: 9 },
];

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function referralReference(index: number): string {
  return `ECL-2026-${String(100000 + index).padStart(6, '0')}`;
}

export const DEMO_REFERRALS: Referral[] = SEED_ROWS.map((row, i) => {
  const practice = DEMO_PRACTICES[row.practiceIndex]!;
  const createdAt = daysAgoIso(row.daysAgo);
  return {
    id: `c0000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
    reference: referralReference(i + 1),
    practiceId: practice.id,
    practiceName: practice.name,
    createdByUserId: row.practiceIndex === 0 ? DEMO_USERS[0]!.id : DEMO_USERS[1]!.id,
    patientFirstName: row.patientFirstName,
    patientLastName: row.patientLastNameInitial,
    patientDob: '1978-06-12',
    patientPhone: '020 7946 0958',
    patientEmail: null,
    preferredContactMethod: 'either',
    patientConsent: true,
    consentConfirmedAt: createdAt,
    treatmentType: row.treatmentType,
    referralReason: null,
    presentingSymptoms: null,
    unaidedVisualAcuity: null,
    bestCorrectedVisualAcuity: null,
    source: 'direct',
    journeyStatus: row.journeyStatus,
    outcome: row.outcome,
    feeAmount: TREATMENT_FEE_MAP[row.treatmentType],
    feeStatus: row.feeStatus,
    createdAt,
    updatedAt: createdAt,
  };
});

export const DEMO_STATUS_HISTORY: ReferralStatusHistoryEntry[] = DEMO_REFERRALS.map((r, i) => ({
  id: `d0000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
  referralId: r.id,
  fromStatus: null,
  toStatus: 'referral_received',
  outcome: null,
  note: 'Referral submitted by practice.',
  changedByUserId: r.createdByUserId,
  changedByName: DEMO_USERS.find((u) => u.id === r.createdByUserId)?.fullName ?? 'Practice user',
  changedAt: r.createdAt,
}));

export const DEMO_TASKS: Task[] = [
  {
    id: 'e0000000-0000-4000-8000-000000000001',
    title: 'Chase two stalled cataract referrals',
    description: 'Follow up with ClearSight Chelsea on referrals booked but not yet attended.',
    priority: 'high',
    status: 'open',
    referralId: null,
    practiceId: DEMO_PRACTICES[4]!.id,
    assignedToUserId: DEMO_USERS[2]!.id,
    assignedToName: DEMO_USERS[2]!.fullName,
    createdByUserId: DEMO_USERS[3]!.id,
    dueDate: daysAgoIso(-2),
    createdAt: daysAgoIso(3),
    updatedAt: daysAgoIso(3),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000002',
    title: 'Send priority appointment leaflets to Vision Plus Opticians',
    description: null,
    priority: 'medium',
    status: 'in_progress',
    referralId: null,
    practiceId: DEMO_PRACTICES[1]!.id,
    assignedToUserId: DEMO_USERS[2]!.id,
    assignedToName: DEMO_USERS[2]!.fullName,
    createdByUserId: DEMO_USERS[2]!.id,
    dueDate: daysAgoIso(-5),
    createdAt: daysAgoIso(6),
    updatedAt: daysAgoIso(1),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000003',
    title: 'Confirm invoice for David Okafor referral fee',
    description: null,
    priority: 'medium',
    status: 'open',
    referralId: DEMO_REFERRALS[3]!.id,
    practiceId: DEMO_PRACTICES[0]!.id,
    assignedToUserId: DEMO_USERS[3]!.id,
    assignedToName: DEMO_USERS[3]!.fullName,
    createdByUserId: DEMO_USERS[2]!.id,
    dueDate: daysAgoIso(-1),
    createdAt: daysAgoIso(2),
    updatedAt: daysAgoIso(2),
  },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'f0000000-0000-4000-8000-000000000001',
    userId: DEMO_USERS[0]!.id,
    type: 'referral_status_change',
    title: 'Consultation booked',
    body: 'Sarah J.’s cataract referral now has a consultation booked.',
    referralId: DEMO_REFERRALS[0]!.id,
    read: false,
    createdAt: daysAgoIso(1),
  },
  {
    id: 'f0000000-0000-4000-8000-000000000002',
    userId: DEMO_USERS[0]!.id,
    type: 'cpd_event',
    title: 'New CPD event announced',
    body: 'Understanding the Evolution & Clinical Impact of Modern Dry Eye Guidelines — 4 CPD points.',
    referralId: null,
    read: false,
    createdAt: daysAgoIso(4),
  },
  {
    id: 'f0000000-0000-4000-8000-000000000003',
    userId: DEMO_USERS[2]!.id,
    type: 'task_assigned',
    title: 'New task assigned',
    body: 'Chase two stalled cataract referrals at ClearSight Chelsea.',
    referralId: null,
    read: true,
    createdAt: daysAgoIso(3),
  },
];

export const DEMO_EDUCATION_RESOURCES: EducationResource[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    type: 'cpd_event',
    title: 'Understanding the Evolution & Clinical Impact of Modern Dry Eye Guidelines',
    description: '4 CPD points · 7 Devonshire St',
    url: 'https://www.eventbrite.com/e/understanding-the-evolution-clinical-impact-of-modern-dry-eye-guidelines-tickets-1993458759813?aff=oddtdtcreator',
    cpdPoints: 4,
    eventDate: '2026-07-21T17:30:00.000Z',
    eventLocation: '7 Devonshire St',
    speakers: 'Mr Samer Hamada · Louise Veenhuis',
    publishedAt: daysAgoIso(20),
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    type: 'clinic_news',
    title: 'Mr Samer Hamada attended CroOphthaCon 2026 in Solin, Croatia',
    description: 'Connecting with the Croatian ophthalmology community.',
    url: 'https://www.linkedin.com/in/samer-hamada-b980621b',
    cpdPoints: null,
    eventDate: null,
    eventLocation: null,
    speakers: null,
    publishedAt: daysAgoIso(15),
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    type: 'clinic_news',
    title: 'Back from the 5th International Dry Eye Congress in Naples',
    description: 'Continuing work on ocular surface disease.',
    url: 'https://www.linkedin.com/in/samer-hamada-b980621b',
    cpdPoints: null,
    eventDate: null,
    eventLocation: null,
    speakers: null,
    publishedAt: daysAgoIso(35),
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    type: 'article',
    title: 'Launch of the Ocular Surface Academy (OSA)',
    description: 'A new platform for international ophthalmology education.',
    url: 'https://www.linkedin.com/in/samer-hamada-b980621b',
    cpdPoints: null,
    eventDate: null,
    eventLocation: null,
    speakers: null,
    publishedAt: daysAgoIso(50),
  },
];

export const DEMO_AUDIT_LOG: AuditLogEntry[] = DEMO_REFERRALS.slice(0, 10).map((r, i) => ({
  id: `20000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
  actorUserId: r.createdByUserId,
  actorName: DEMO_USERS.find((u) => u.id === r.createdByUserId)?.fullName ?? 'Practice user',
  action: 'referral.created',
  entityType: 'referral',
  entityId: r.id,
  practiceId: r.practiceId,
  metadata: { reference: r.reference, treatmentType: r.treatmentType },
  createdAt: r.createdAt,
}));

export function findDemoUserByEmail(email: string): UserProfile | undefined {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
