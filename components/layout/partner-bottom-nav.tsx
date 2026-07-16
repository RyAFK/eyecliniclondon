'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, TrendingUp, UserPlus } from 'lucide-react';
import { COLOR } from '@/lib/theme';

export function PartnerBottomNav() {
  const pathname = usePathname();

  // Plain opaque background — see the comment in partner-header.tsx: a
  // `${COLOR.bg}F5`-style alpha suffix is invalid CSS on a var() reference,
  // which left this bar fully transparent and, combined with backdrop-filter,
  // showed scrolled-past content blurred right through it.
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40" style={{ background: COLOR.bg, borderTop: `1px solid ${COLOR.border}`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto flex max-w-5xl items-end justify-around px-4 pb-2 pt-2">
        <Link href="/dashboard" className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-3 py-1.5" style={{ color: pathname === '/dashboard' ? COLOR.text : COLOR.textMuted }}>
          <Home size={20} strokeWidth={pathname === '/dashboard' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>

        <Link href="/dashboard/insights" className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-3 py-1.5" style={{ color: pathname === '/dashboard/insights' ? COLOR.text : COLOR.textMuted }}>
          <TrendingUp size={20} strokeWidth={pathname === '/dashboard/insights' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">Insights</span>
        </Link>

        <Link href="/dashboard/referrals" className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-3 py-1.5" style={{ color: pathname === '/dashboard/referrals' ? COLOR.text : COLOR.textMuted }}>
          <ListChecks size={20} strokeWidth={pathname === '/dashboard/referrals' ? 2.4 : 1.8} />
          <span className="text-[11px] font-medium">My Referrals</span>
        </Link>

        <Link href="/dashboard/refer" className="ecl-btn ecl-press -mt-6 flex flex-col items-center gap-1">
          <span className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg" style={{ background: COLOR.accent, color: COLOR.primary, border: `4px solid ${COLOR.bg}` }}>
            <UserPlus size={22} />
          </span>
          <span className="whitespace-nowrap text-[10px] font-medium" style={{ color: pathname === '/dashboard/refer' ? COLOR.text : COLOR.textMuted }}>
            Refer a Patient
          </span>
        </Link>
      </div>
    </nav>
  );
}
