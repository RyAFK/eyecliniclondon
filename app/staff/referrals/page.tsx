import { requireStaff } from '@/lib/auth';
import { referralsService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { AdminOverview } from '@/components/staff/admin-overview';
import { ReferralsTable } from '@/components/staff/referrals-table';

export default async function StaffReferralsPage() {
  const user = await requireStaff();
  const referrals = await referralsService.listReferrals(user);

  return (
    <>
      <h1 className="ecl-fade-up text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Referrals
      </h1>
      <AdminOverview referrals={referrals} />
      <div className="mt-6">
        <ReferralsTable referrals={referrals} />
      </div>
    </>
  );
}
