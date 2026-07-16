'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ClipboardList, FileText, LogOut, PoundSterling, ShieldCheck, TrendingUp, Users2 } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { EclWordmark } from '@/components/ui/ecl-wordmark';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/ui/theme-provider';
import { signOutAction } from '@/lib/actions/auth-actions';
import type { UserRole } from '@/types/user';

const NAV_ITEMS = [
  { label: 'Home', href: '/staff', icon: ClipboardList },
  { label: 'Analytics', href: '/staff/analytics', icon: TrendingUp },
  { label: 'Referrals', href: '/staff/referrals', icon: FileText },
  { label: 'Partners', href: '/staff/partners', icon: Users2 },
  { label: 'Tasks', href: '/staff/tasks', icon: Activity },
  { label: 'Fees', href: '/staff/fees', icon: PoundSterling },
];

const ADMIN_ONLY_ITEMS = [{ label: 'Audit log', href: '/staff/audit', icon: ShieldCheck }];

export function StaffHeader({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const items = role === 'ecl_admin' ? [...NAV_ITEMS, ...ADMIN_ONLY_ITEMS] : NAV_ITEMS;

  // Plain opaque background — see the comment in partner-header.tsx: a
  // `${COLOR.bg}F2`-style alpha suffix is invalid CSS on a var() reference,
  // which left this sticky header fully transparent and, combined with
  // backdrop-filter, showed scrolled-past content blurred right through it.
  return (
    <header className="sticky top-0 z-40" style={{ background: COLOR.bg, borderBottom: `1px solid ${COLOR.border}` }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/staff">
            <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" />
          </Link>
          <span style={{ width: 1, height: 24, background: COLOR.border }} />
          <p className="text-xs font-semibold uppercase leading-tight tracking-wide" style={{ color: COLOR.textMuted }}>
            Business
            <br />
            Development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle inline />
          <form action={signOutAction}>
            <button type="submit" className="ecl-btn flex h-9 w-9 items-center justify-center rounded-full" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 pb-2">
        <nav className="flex items-center gap-1.5">
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === '/staff' ? pathname === '/staff' : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className="ecl-btn flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium"
                style={active ? { background: COLOR.primary, color: '#fff' } : { background: COLOR.recessed, color: COLOR.textMuted }}
              >
                <Icon size={14} /> {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
