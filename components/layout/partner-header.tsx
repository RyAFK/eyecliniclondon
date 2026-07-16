'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Building2, ChevronDown, GraduationCap, Home, ListChecks, LogOut, Menu, X } from 'lucide-react';
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Plain opaque background — `${COLOR.bg}F2`-style alpha suffixes don't work
  // here because COLOR.bg is a `var(--ecl-bg)` reference, not a hex literal,
  // so appending a hex alpha byte to it is invalid CSS and gets dropped
  // entirely, leaving the header fully transparent. Combined with
  // backdrop-filter that meant scrolled-past content was blurred and visible
  // right through this sticky header — the "overlapping" ghosting bug.
  return (
    <header className="sticky top-0 z-40" style={{ background: COLOR.bg, borderBottom: `1px solid ${COLOR.border}` }}>
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
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            className="ecl-btn flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
            style={{ background: COLOR.recessed, color: COLOR.text }}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="ecl-fade-in border-t px-4 py-3 lg:hidden" style={{ borderColor: COLOR.border, background: COLOR.bg }}>
          <div className="mx-auto flex max-w-5xl flex-col gap-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className="ecl-btn flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
                  style={active ? { background: COLOR.primaryTint, color: COLOR.text } : { color: COLOR.textMuted }}
                >
                  <Icon size={17} /> {label}
                </Link>
              );
            })}
            <Link
              href="/dashboard/refer"
              className="ecl-btn ecl-press mt-2 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:hidden"
              style={{ background: COLOR.primary }}
            >
              Refer a Patient
            </Link>
            <div className="mt-2 flex items-center gap-2 border-t px-3 pt-3 text-sm sm:hidden" style={{ borderColor: COLOR.border, color: COLOR.textMuted }}>
              <Building2 size={16} />
              {practiceName}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
