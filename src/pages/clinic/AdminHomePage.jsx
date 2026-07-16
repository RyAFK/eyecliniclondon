import { PageHeader } from '../../components/layout/PageHeader';
import { practiceBreakdown } from '../../data/referrals';
import { PrioritiesSection } from './PrioritiesSection';
import { BDSummaryCard } from './BDSummaryCard';
import { BDStatSquares } from './BDStatSquares';
import { ConversionBanner } from './ConversionBanner';
import { PatientJourneyFunnel } from './PatientJourneyFunnel';
import { TreatmentDonut } from './TreatmentDonut';
import { TopPartnersCard } from './TopPartnersCard';
import { FollowUpsCard } from './FollowUpsCard';

export function AdminHomePage({ referrals, onViewAllPartners }) {
  const topPractice = practiceBreakdown(referrals)[0]?.practice;
  return (
    <div>
      <PageHeader eyebrow="Business Development" title="Dashboard" description="Today's priorities and clinic-wide referral performance." />
      <PrioritiesSection referrals={referrals} />
      <BDSummaryCard referrals={referrals} topPractice={topPractice} />
      <BDStatSquares referrals={referrals} />
      <ConversionBanner referrals={referrals} />
      <PatientJourneyFunnel referrals={referrals} />
      <TreatmentDonut referrals={referrals} />
      <TopPartnersCard referrals={referrals} onViewAll={onViewAllPartners} />
      <FollowUpsCard />
    </div>
  );
}
