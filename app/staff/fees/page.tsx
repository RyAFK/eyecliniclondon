import { CheckCircle2, Clock3, FileText, PoundSterling } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { referralsService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { CountUp } from '@/components/ui/count-up';
import { feeSummary } from '@/services/analytics.service';
import { FeesTable } from '@/components/staff/fees-table';

export default async function StaffFeesPage() {
  const user = await requireStaff();
  const referrals = await referralsService.listReferrals(user);
  const fees = feeSummary(referrals);

  const stats = [
    { label: 'Total earned', value: fees.totalEarned, Icon: PoundSterling, tone: 'default' as const },
    { label: 'Paid', value: fees.paid, Icon: CheckCircle2, tone: 'complete' as const },
    { label: 'Invoiced', value: fees.invoiced, Icon: FileText, tone: 'info' as const },
    { label: 'Pending', value: fees.pending, Icon: Clock3, tone: 'action' as const },
  ];

  return (
    <>
      <h1 className="ecl-fade-up text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Referral fees
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: COLOR.accentTint, color: COLOR.accent }}>
              <s.Icon size={16} />
            </span>
            <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
              £<CountUp value={Math.round(s.value)} locale />
            </p>
            <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <FeesTable referrals={referrals.filter((r) => r.feeStatus !== 'not_eligible')} />
      </div>
    </>
  );
}
