import { requirePartner } from '@/lib/auth';
import { referralsService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings } from '@/components/ui/motifs';
import { ListChecks } from 'lucide-react';
import { ReferralStatCards } from '@/components/referrals/referral-stat-cards';
import { ReferralList } from '@/components/referrals/referral-list';

export default async function MyReferralsPage() {
  const user = await requirePartner();
  const referrals = await referralsService.listReferrals(user);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <ListChecks size={14} /> {referrals[0]?.practiceName ?? 'Your practice'}
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            My referrals
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {referrals.length} referral{referrals.length !== 1 ? 's' : ''} sent to Eye Clinic London.
          </p>
        </div>
      </div>

      <ReferralStatCards referrals={referrals} />
      <ReferralList referrals={referrals} />
    </div>
  );
}
