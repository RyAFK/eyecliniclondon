import { Building2, Mail, Phone, UserCircle } from 'lucide-react';
import { requirePartner } from '@/lib/auth';
import { practicesService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings } from '@/components/ui/motifs';
import { ProfileForm } from '@/components/account/profile-form';
import { ContactRyanCard } from '@/components/shared/contact-ryan-card';

const ROLE_LABELS: Record<string, string> = {
  partner_user: 'Referring practice user',
  partner_admin: 'Practice administrator',
  ecl_staff: 'Eye Clinic London staff',
  ecl_admin: 'Eye Clinic London admin',
};

export default async function AccountPage() {
  const user = await requirePartner();
  const practice = user.practiceId ? await practicesService.getPractice(user, user.practiceId) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <UserCircle size={14} /> Account
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            {user.fullName}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {ROLE_LABELS[user.role] ?? user.role} · {user.email}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm fullName={user.fullName} notificationPreferences={user.notificationPreferences} />
        </div>

        <div className="space-y-6">
          <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
            <h2 className="mb-3 flex items-center gap-2 font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
              <Building2 size={16} style={{ color: COLOR.secondary }} /> Practice details
            </h2>
            {practice ? (
              <div className="space-y-1.5 text-sm" style={{ color: COLOR.text }}>
                <p className="font-medium">{practice.name}</p>
                {practice.addressLine1 && (
                  <p style={{ color: COLOR.textMuted }}>
                    {practice.addressLine1}
                    {practice.city ? `, ${practice.city}` : ''} {practice.postcode ?? ''}
                  </p>
                )}
                {practice.phone && (
                  <p className="flex items-center gap-1.5" style={{ color: COLOR.textMuted }}>
                    <Phone size={13} /> {practice.phone}
                  </p>
                )}
                {practice.email && (
                  <p className="flex items-center gap-1.5" style={{ color: COLOR.textMuted }}>
                    <Mail size={13} /> {practice.email}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm" style={{ color: COLOR.textMuted }}>
                No practice details on file.
              </p>
            )}
            <p className="mt-3 text-xs" style={{ color: COLOR.textMuted }}>
              Practice details are managed by Eye Clinic London. Contact Ryan below if anything needs updating.
            </p>
          </div>

          <ContactRyanCard />
        </div>
      </div>
    </div>
  );
}
