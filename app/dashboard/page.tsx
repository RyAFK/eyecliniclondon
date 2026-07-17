import { requirePartner } from '@/lib/auth';
import { educationService, practicesService, referralsService } from '@/services';
import { DashboardHero } from '@/components/dashboard/hero';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ReferralAssistantCard } from '@/components/dashboard/referral-assistant-card';
import { EducationSpotlightCard } from '@/components/dashboard/education-spotlight-card';
import { ReferralStatCards } from '@/components/referrals/referral-stat-cards';
import { CpdNewsSection } from '@/components/education/cpd-news-section';
import { TrustpilotCarousel, SuccessStories, JimRosenthalStory, HereToHelp } from '@/components/dashboard/marketing-sections';
import { EDUCATION_MODULES } from '@/lib/education-modules';

export default async function DashboardPage() {
  const user = await requirePartner();
  const [resources, practice, referrals, moduleProgress] = await Promise.all([
    educationService.listEducationResources(),
    practicesService.getPractice(user, user.practiceId!),
    referralsService.listReferrals(user),
    educationService.listModuleProgress(user),
  ]);

  const completedIds = new Set(moduleProgress.filter((p) => p.completed).map((p) => p.moduleId));
  const nextModule = EDUCATION_MODULES.find((m) => !completedIds.has(m.id)) ?? EDUCATION_MODULES[0];
  const allCompleted = completedIds.size >= EDUCATION_MODULES.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <DashboardHero firstName={user.fullName.split(' ')[0] ?? user.fullName} practiceName={practice?.name ?? ''} />
      {nextModule && (
        <EducationSpotlightCard module={nextModule} completedCount={completedIds.size} totalCount={EDUCATION_MODULES.length} allCompleted={allCompleted} />
      )}
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
