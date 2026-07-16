import { Users2, Mail, Phone } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';

export function HereToHelp() {
  const COLOR = useColors();
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '240ms', background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.bg, color: COLOR.accent }}>
          <Users2 size={22} />
        </span>
        <div>
          <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>We're here to help</h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            Have a question about our treatments? Need patient leaflets for your practice or access to priority appointments?
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            Our Business Development Manager, Ryan, is here to help.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:ryan@eyecliniclondon.com"
              onClick={() => { window.location.href = 'mailto:ryan@eyecliniclondon.com'; }}
              className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
              style={{ background: COLOR.primary }}
            >
              <Mail size={15} /> ryan@eyecliniclondon.com
            </a>
            <a
              href="tel:+447340890623"
              className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}
            >
              <Phone size={15} /> 07340 890 623
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
