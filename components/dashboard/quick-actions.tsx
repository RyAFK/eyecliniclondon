import Link from 'next/link';
import { BookOpen, ListChecks, Sparkles, TrendingUp, UserPlus } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';

const ACTIONS = [
  { label: 'Refer a Patient', href: '/dashboard/refer', icon: UserPlus },
  { label: 'View Referrals', href: '/dashboard/referrals', icon: ListChecks },
  { label: 'Referral Assistant', href: '/dashboard/referral-assistant', icon: Sparkles },
  { label: 'Clinical Education & CPD', href: '/dashboard/education', icon: BookOpen },
  { label: 'Practice Insights', href: '/dashboard/insights', icon: TrendingUp },
];

export function QuickActions() {
  return (
    <div className="ecl-fade-up mt-8" style={{ animationDelay: '40ms' }}>
      <h2 className="mb-3 text-sm font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Quick actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIONS.map(({ label, href, icon: Icon }, i) => (
          <Link
            key={label}
            href={href}
            className="ecl-fade-up ecl-lift ecl-press flex flex-col items-start gap-3 rounded-2xl p-4"
            style={{ animationDelay: `${i * 40}ms`, background: COLOR.bg, border: `1px solid ${COLOR.border}` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: COLOR.primaryTint, color: COLOR.primary }}>
              <Icon size={18} />
            </span>
            <span className="text-sm font-medium" style={{ color: COLOR.text }}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
