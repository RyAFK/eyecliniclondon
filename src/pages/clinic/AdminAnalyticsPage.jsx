import { PageHeader } from '../../components/layout/PageHeader';
import { ConversionBanner } from './ConversionBanner';
import { PatientJourneyFunnel } from './PatientJourneyFunnel';
import { TreatmentDonut } from './TreatmentDonut';

export function AdminAnalyticsPage({ referrals }) {
  return (
    <div>
      <PageHeader eyebrow="Business Development" title="Analytics" description="Conversion, funnel performance and treatment mix across all partners." />
      <ConversionBanner referrals={referrals} />
      <PatientJourneyFunnel referrals={referrals} />
      <TreatmentDonut referrals={referrals} />
    </div>
  );
}
