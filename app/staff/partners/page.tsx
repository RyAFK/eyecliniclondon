import Link from 'next/link';
import { Building2, Mail, Phone } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { referralsService, practicesService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { PartnersLeaderboard } from '@/components/staff/home-widgets';

export default async function StaffPartnersPage() {
  const user = await requireStaff();
  const [referrals, practices] = await Promise.all([referralsService.listReferrals(user), practicesService.listPractices(user)]);

  return (
    <>
      <h1 className="ecl-fade-up text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Partners
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PartnersLeaderboard referrals={referrals} />
        </div>
        <div className="lg:col-span-3">
          <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
            <h2 className="mb-4 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
              <Building2 size={16} style={{ color: COLOR.secondary }} /> All practices
            </h2>
            <ul className="divide-y" style={{ borderColor: COLOR.border }}>
              {practices.map((p) => (
                <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/staff/partners/${p.id}`} className="ecl-lift flex items-center justify-between gap-3 rounded-lg p-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                        {p.name}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: COLOR.textMuted }}>
                        {p.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {p.phone}
                          </span>
                        )}
                        {p.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={11} /> {p.email}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
