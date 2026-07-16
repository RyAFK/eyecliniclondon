import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { PageHeader } from '../../components/layout/PageHeader';

export function AccountPage() {
  const COLOR = useColors();
  const rows = [
    { Icon: Building2, label: 'Practice', value: 'Keith Holland Opticians' },
    { Icon: Mail, label: 'Sign-in email', value: 'jane@keithhollandopticians.co.uk' },
    { Icon: Phone, label: 'Practice phone', value: '020 7000 0000' },
    { Icon: MapPin, label: 'Practice address', value: 'Marylebone, London' },
  ];
  return (
    <div>
      <PageHeader eyebrow="Your account" title="Account" description="Practice and sign-in details for this referring-partner account." />
      <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <ul className="divide-y" style={{ borderColor: COLOR.border }}>
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.recessed, color: COLOR.secondary }}>
                <r.Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-xs" style={{ color: COLOR.textMuted }}>{r.label}</p>
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
