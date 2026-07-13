import { requirePartner } from '@/lib/auth';
import { practicesService } from '@/services';
import { PartnerHeader } from '@/components/layout/partner-header';
import { PartnerBottomNav } from '@/components/layout/partner-bottom-nav';
import { Footer } from '@/components/layout/footer';

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePartner();
  const practice = user.practiceId ? await practicesService.getPractice(user, user.practiceId) : null;

  return (
    <div>
      <PartnerHeader practiceName={practice?.name ?? 'Your practice'} userName={user.fullName} />
      <div className="ecl-fade-in">{children}</div>
      <Footer />
      <PartnerBottomNav />
    </div>
  );
}
