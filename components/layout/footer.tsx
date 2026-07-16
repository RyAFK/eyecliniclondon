'use client';

import { Clock3 } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { EclWordmark } from '@/components/ui/ecl-wordmark';
import { useTheme } from '@/components/ui/theme-provider';

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="mx-auto max-w-5xl px-4 pb-24 pt-8 lg:pb-4">
      <div className="flex flex-col items-center gap-2 border-t pt-6 text-center" style={{ borderColor: COLOR.border }}>
        <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" className="opacity-70" />
        <p className="text-xs" style={{ color: COLOR.textMuted }}>
          7 Devonshire Street, Marylebone, London W1W 5DY · 0203 974 4454 · info@eyecliniclondon.com
        </p>
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <p className="flex items-center gap-1 text-xs" style={{ color: COLOR.textMuted }}>
            <Clock3 size={12} /> Demo mode — fictional data, nothing is sent to a real clinic.
          </p>
        )}
      </div>
    </footer>
  );
}
