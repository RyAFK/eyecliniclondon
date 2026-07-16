import { ReferralWizard } from '@/components/referrals/referral-wizard';
import { TREATMENT_TYPES, type TreatmentTypeId } from '@/types/referral';

export default function ReferPage({ searchParams }: { searchParams: { treatment?: string; source?: string } }) {
  const initialTreatmentId = TREATMENT_TYPES.some((t) => t.id === searchParams.treatment) ? (searchParams.treatment as TreatmentTypeId) : undefined;
  const source = searchParams.source === 'referral_assistant' ? 'referral_assistant' : 'direct';

  return <ReferralWizard initialTreatmentId={initialTreatmentId} source={source} />;
}
