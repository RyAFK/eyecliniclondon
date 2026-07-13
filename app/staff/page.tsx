import { requireStaff } from '@/lib/auth';
import { referralsService, tasksService, practicesService } from '@/services';
import {
  PrioritiesSection,
  BDSummaryCard,
  BDStatSquares,
  ConversionBanner,
  PatientJourneyFunnel,
  TreatmentDonut,
  TopPartnersCard,
  FollowUpsCard,
} from '@/components/staff/home-widgets';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function StaffHomePage() {
  const user = await requireStaff();
  const [referrals, tasks, practices] = await Promise.all([
    referralsService.listReferrals(user),
    tasksService.listTasks(user),
    practicesService.listPractices(user),
  ]);

  const now = Date.now();
  const lastReferralByPractice = new Map<string, number>();
  referrals.forEach((r) => {
    const t = new Date(r.createdAt).getTime();
    const existing = lastReferralByPractice.get(r.practiceId);
    if (!existing || t > existing) lastReferralByPractice.set(r.practiceId, t);
  });
  const stalePracticeNames = practices
    .filter((p) => p.active)
    .filter((p) => {
      const last = lastReferralByPractice.get(p.id);
      return !last || now - last > THIRTY_DAYS_MS;
    })
    .map((p) => p.name);

  return (
    <>
      <PrioritiesSection referrals={referrals} stalePracticeNames={stalePracticeNames} />
      <BDSummaryCard referrals={referrals} />
      <BDStatSquares referrals={referrals} />
      <ConversionBanner referrals={referrals} />
      <PatientJourneyFunnel referrals={referrals} />
      <TreatmentDonut referrals={referrals} />
      <TopPartnersCard referrals={referrals} onViewAllHref="/staff/partners" />
      <FollowUpsCard tasks={tasks} />
      <p className="mt-8 text-center text-xs" style={{ color: 'var(--ecl-text-muted)' }}>
        Every figure above is computed live from the canonical referrals dataset — no hard-coded metrics.
      </p>
    </>
  );
}
