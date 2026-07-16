import { requirePartner } from '@/lib/auth';
import { educationService, practicesService, referralsService } from '@/services';
import { DashboardHero } from '@/components/dashboard/hero';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ReferralAssistantCard } from '@/components/dashboard/referral-assistant-card';
import { ReferralStatCards } from '@/components/referrals/referral-stat-cards';
import { CpdNewsSection } from '@/components/education/cpd-news-section';
import { TrustpilotCarousel, SuccessStories, JimRosenthalStory, HereToHelp } from '@/components/dashboard/marketing-sections';

export default async function DashboardPage() {
  const user = await requirePartner();
  const [resources, practice, referrals] = await Promise.all([
    educationService.listEducationResources(),
    practicesService.getPractice(user, user.practiceId!),
    referralsService.listReferrals(user),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <DashboardHero firstName={user.fullName.split(' ')[0] ?? user.fullName} practiceName={practice?.name ?? ''} />
      <ReferralStatCards referrals={referrals} />
      <ReferralAssistantCard />
      <QuickActions />
      <CpdNewsSection resources={resources} />
      <TrustpilotCarousel />
      <SuccessStories />
      <JimRosenthalStory />
      <HereToHelp />
    </div>
  );
}
