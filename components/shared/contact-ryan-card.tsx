import { Mail, Phone, Users2 } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';

/**
 * Reusable "contact Ryan" touchpoint — used on the dashboard, the Referral
 * Assistant results screen, and the account page. Ryan is Eye Clinic
 * London's Business Development Manager; only the first name is ever shown.
 */
export function ContactRyanCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.bg, color: COLOR.accent }}>
          <Users2 size={18} />
        </span>
        <div>
          {!compact && (
            <h3 className="text-base" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
              Contact Ryan
            </h3>
          )}
          <p className="mt-1 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            Our Business Development Manager, Ryan, is here to help with referral pathway questions, patient leaflets or practice visits.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <a href="mailto:ryan@eyecliniclondon.com" className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-white" style={{ background: COLOR.primary }}>
              <Mail size={13} /> Email Ryan
            </a>
            <a href="tel:+447340890623" className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}>
              <Phone size={13} /> Call Ryan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
