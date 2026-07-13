import { requirePartner } from '@/lib/auth';
import { educationService, practicesService } from '@/services';
import { DashboardHero } from '@/components/dashboard/hero';
import { CpdNewsSection } from '@/components/education/cpd-news-section';
import { TrustpilotCarousel, SuccessStories, JimRosenthalStory, HereToHelp } from '@/components/dashboard/marketing-sections';

export default async function DashboardPage() {
  const user = await requirePartner();
  const [resources, practice] = await Promise.all([
    educationService.listEducationResources(),
    practicesService.getPractice(user, user.practiceId!),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <DashboardHero firstName={user.fullName.split(' ')[0] ?? user.fullName} practiceName={practice?.name ?? ''} />
      <CpdNewsSection resources={resources} />
      <TrustpilotCarousel />
      <SuccessStories />
      <JimRosenthalStory />
      <HereToHelp />
    </div>
  );
}
