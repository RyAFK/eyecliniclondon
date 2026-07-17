'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Home, ListChecks, UserCircle, UserPlus } from 'lucide-react';
import { COLOR } from '@/lib/theme';

// Plain opaque background — see the comment in partner-header.tsx: a
// `${COLOR.bg}F5`-style alpha suffix is invalid CSS on a var() reference,
// which left this bar fully transparent and, combined with backdrop-filter,
// showed scrolled-past content blurred right through it.
export function PartnerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden" style={{ background: COLOR.bg, borderTop: `1px solid ${COLOR.border}`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto grid max-w-5xl grid-cols-5 items-end px-2 pb-2 pt-2">
        <Link href="/dashboard" className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-2 py-1.5" style={{ color: pathname === '/dashboard' ? COLOR.text : COLOR.textMuted }}>
          <Home size={20} strokeWidth={pathname === '/dashboard' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>

        <Link
          href="/dashboard/referrals"
          className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-2 py-1.5"
          style={{ color: pathname === '/dashboard/referrals' ? COLOR.text : COLOR.textMuted }}
        >
          <ListChecks size={20} strokeWidth={pathname === '/dashboard/referrals' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Referrals</span>
        </Link>

        <Link href="/dashboard/refer" className="ecl-btn ecl-press flex flex-col items-center gap-1 justify-self-center">
          <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg" style={{ background: COLOR.accent, color: COLOR.primary, border: `4px solid ${COLOR.bg}` }}>
            <UserPlus size={22} />
          </span>
          <span className="whitespace-nowrap text-[10px] font-medium" style={{ color: pathname === '/dashboard/refer' ? COLOR.text : COLOR.textMuted }}>
            Refer
          </span>
        </Link>

        <Link
          href="/dashboard/education"
          className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-2 py-1.5"
          style={{ color: pathname === '/dashboard/education' ? COLOR.text : COLOR.textMuted }}
        >
          <GraduationCap size={20} strokeWidth={pathname === '/dashboard/education' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Education</span>
        </Link>

        <Link
          href="/dashboard/account"
          className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-2 py-1.5"
          style={{ color: pathname === '/dashboard/account' ? COLOR.text : COLOR.textMuted }}
        >
          <UserCircle size={20} strokeWidth={pathname === '/dashboard/account' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );
}
