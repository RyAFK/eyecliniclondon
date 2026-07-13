'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Building2, ChevronDown, GraduationCap, Home, ListChecks, LogOut } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { EclWordmark } from '@/components/ui/ecl-wordmark';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/ui/theme-provider';
import { signOutAction } from '@/lib/actions/auth-actions';
import { initials } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Referrals', href: '/dashboard/referrals', icon: ListChecks },
  { label: 'Education', href: '/dashboard/education', icon: GraduationCap },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

export function PartnerHeader({ practiceName, userName }: { practiceName: string; userName: string }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{ background: `${COLOR.bg}F2`, borderBottom: `1px solid ${COLOR.border}`, backdropFilter: 'blur(6px)' }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className="ecl-btn flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
                  style={active ? { background: COLOR.primaryTint, color: COLOR.text } : { color: COLOR.textMuted }}
                >
                  <Icon size={16} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm sm:flex" style={{ color: COLOR.textMuted }}>
            <Building2 size={16} />
            {practiceName}
            <ChevronDown size={14} />
          </div>
          <Link
            href="/dashboard/refer"
            className="ecl-btn ecl-press hidden rounded-lg px-4 py-2 text-sm font-medium text-white sm:flex"
            style={{ background: COLOR.primary }}
          >
            Refer a Patient
          </Link>
          <ThemeToggle inline />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="ecl-btn flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ background: COLOR.primary }}
            >
              {initials(userName)}
            </button>
            {menuOpen && (
              <div className="ecl-scale-in absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-lg" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-black/5"
                    style={{ color: COLOR.text }}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
