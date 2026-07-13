import { Pill } from '@/components/ui/pill';
import { JOURNEY_STATUS_LABELS, REFERRAL_OUTCOME_LABELS, type JourneyStatus, type ReferralOutcome } from '@/types/referral';
import type { Tone } from '@/lib/theme';

const STATUS_TONE: Record<JourneyStatus, Tone> = {
  referral_received: 'info',
  awaiting_consultation: 'action',
  consultation_booked: 'purple',
  treatment_recommended: 'action',
  treatment_booked: 'teal',
  treatment_completed: 'complete',
  closed: 'closed',
};

export function JourneyStatusBadge({ status }: { status: JourneyStatus }) {
  return <Pill tone={STATUS_TONE[status]}>{JOURNEY_STATUS_LABELS[status]}</Pill>;
}

const OUTCOME_TONE: Record<ReferralOutcome, Tone> = {
  treatment_successful: 'complete',
  ongoing_care: 'teal',
  patient_declined: 'closed',
  did_not_attend: 'action',
  clinically_unsuitable: 'closed',
  referred_elsewhere: 'closed',
  other: 'default',
};

export function OutcomeBadge({ outcome }: { outcome: ReferralOutcome }) {
  return <Pill tone={OUTCOME_TONE[outcome]}>{REFERRAL_OUTCOME_LABELS[outcome]}</Pill>;
}

export { STATUS_TONE };
