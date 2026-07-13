import { TrendingUp } from 'lucide-react';
import { requirePartner } from '@/lib/auth';
import { referralsService, practicesService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings } from '@/components/ui/motifs';
import { PartnerInsights } from '@/components/analytics/insights-charts';

export default async function InsightsPage() {
  const user = await requirePartner();
  const [referrals, practice] = await Promise.all([
    referralsService.listReferrals(user),
    practicesService.getPractice(user, user.practiceId!),
  ]);
  const practiceName = practice?.name ?? 'your practice';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <TrendingUp size={14} /> For {practiceName}
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            Practice insights
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">A look at how your referrals to Eye Clinic London have grown over the last six months.</p>
        </div>
      </div>

      <PartnerInsights referrals={referrals} practiceName={practiceName} />
    </div>
  );
}
