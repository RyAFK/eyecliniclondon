import { PageHeader } from '../../components/layout/PageHeader';
import { HereToHelp } from '../../components/marketing/HereToHelp';

export function ReferralAssistantPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Referral Assistant"
        title="Need a hand with a referral?"
        description="Our Business Development Manager can help with treatment questions, patient leaflets or priority appointments."
      />
      <HereToHelp />
    </div>
  );
}
