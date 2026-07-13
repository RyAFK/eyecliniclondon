import { requireStaff } from '@/lib/auth';
import { referralsService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { ConversionBanner, PatientJourneyFunnel, TreatmentDonut, ReferralVolumeBars } from '@/components/staff/home-widgets';
import { OutcomeBreakdown } from '@/components/staff/outcome-breakdown';

export default async function StaffAnalyticsPage() {
  const user = await requireStaff();
  const referrals = await referralsService.listReferrals(user);

  return (
    <>
      <h1 className="ecl-fade-up text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Analytics
      </h1>
      <ConversionBanner referrals={referrals} />
      <PatientJourneyFunnel referrals={referrals} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TreatmentDonut referrals={referrals} />
        <OutcomeBreakdown referrals={referrals} />
      </div>
      <ReferralVolumeBars referrals={referrals} />
    </>
  );
}
