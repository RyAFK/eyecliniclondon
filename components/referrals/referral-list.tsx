import Link from 'next/link';
import { ListChecks, Sparkles } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { JourneyStatusBadge } from '@/components/referrals/status-badge';
import { Pill } from '@/components/ui/pill';
import { treatmentName, type Referral } from '@/types/referral';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ReferralList({ referrals, staffLinks = false }: { referrals: Referral[]; staffLinks?: boolean }) {
  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
        <ListChecks size={16} style={{ color: COLOR.secondary }} /> Recent referrals
      </h2>
      <ul className="space-y-2.5">
        {referrals.length === 0 && (
          <li className="rounded-xl p-6 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
            No referrals yet — submit one via &ldquo;Refer a Patient&rdquo;.
          </li>
        )}
        {referrals.map((r, i) => {
          const row = (
            <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl p-3.5" style={{ background: COLOR.recessed }}>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                  {r.patientFirstName} {r.patientLastName.charAt(0)}. · {treatmentName(r.treatmentType)}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: COLOR.textMuted }}>
                  <span>
                    {r.reference} · {formatDate(r.createdAt)} · {formatCurrency(r.feeAmount)}
                  </span>
                  {r.source === 'referral_assistant' && (
                    <Pill tone="accent">
                      <span className="flex items-center gap-1">
                        <Sparkles size={10} /> Assistant
                      </span>
                    </Pill>
                  )}
                </p>
              </div>
              <JourneyStatusBadge status={r.journeyStatus} />
            </div>
          );
          return (
            <li key={r.id} className="ecl-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              {staffLinks ? (
                <Link href={`/staff/referrals/${r.id}`} className="ecl-lift block rounded-xl">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
