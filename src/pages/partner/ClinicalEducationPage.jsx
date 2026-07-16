import { PageHeader } from '../../components/layout/PageHeader';
import { CpdNewsSection } from '../../components/marketing/CpdNewsSection';
import { SuccessStories } from '../../components/marketing/SuccessStories';
import { JimRosenthalStory } from '../../components/marketing/JimRosenthalStory';

export function ClinicalEducationPage() {
  return (
    <div>
      <PageHeader
        eyebrow="For our referring partners"
        title="Clinical Education"
        description="CPD events, clinic news and patient stories to share with your team."
      />
      <CpdNewsSection />
      <SuccessStories />
      <JimRosenthalStory />
    </div>
  );
}
