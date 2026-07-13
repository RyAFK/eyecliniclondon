'use client';

import { Moon, Sun } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { useTheme } from '@/components/ui/theme-provider';

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle day / night view"
      className={`ecl-btn ecl-press flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${inline ? '' : 'fixed right-4 top-4 z-[70] shadow-md'}`}
      style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: theme === 'day' ? COLOR.secondary : COLOR.accent }}
    >
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
