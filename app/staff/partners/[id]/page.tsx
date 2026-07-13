import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { referralsService, practicesService, usersService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { practiceBreakdown } from '@/services/analytics.service';
import { ReferralList } from '@/components/referrals/referral-list';
import { formatCurrency } from '@/lib/utils';

export default async function PartnerDetailPage({ params }: { params: { id: string } }) {
  const user = await requireStaff();
  const practice = await practicesService.getPractice(user, params.id);
  if (!practice) notFound();

  const [allReferrals, practiceUsers] = await Promise.all([
    referralsService.listReferrals(user, { practiceId: practice.id }),
    usersService.listUsers(user, { practiceId: practice.id }),
  ]);

  const stats = practiceBreakdown(allReferrals)[0];

  return (
    <>
      <Link href="/staff/partners" className="ecl-underline mb-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.textMuted }}>
        <ArrowLeft size={15} /> Back to partners
      </Link>

      <div className="ecl-fade-up relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-8" style={{ background: COLOR.primary }}>
        <h1 className="text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
          {practice.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/70">
          {practice.addressLine1 && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {practice.addressLine1}, {practice.city} {practice.postcode}
            </span>
          )}
          {practice.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {practice.phone}
            </span>
          )}
          {practice.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {practice.email}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {allReferrals.length}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            Total referrals
          </p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {stats?.treated ?? 0}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            Treated
          </p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {formatCurrency(stats?.fees ?? 0)}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            Fees generated
          </p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {practiceUsers.length}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            Practice contacts
          </p>
        </div>
      </div>

      {practiceUsers.length > 0 && (
        <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <h2 className="mb-3 font-medium" style={{ color: COLOR.text }}>
            Practice contacts
          </h2>
          <ul className="divide-y" style={{ borderColor: COLOR.border }}>
            {practiceUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-sm">
                <span style={{ color: COLOR.text }}>{u.fullName}</span>
                <span style={{ color: COLOR.textMuted }}>{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ReferralList referrals={allReferrals} staffLinks />
    </>
  );
}
