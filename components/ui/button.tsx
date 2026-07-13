'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { COLOR } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'outline';

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary: { background: COLOR.primary, color: '#fff' },
  accent: { background: COLOR.accent, color: COLOR.primary },
  secondary: { background: COLOR.accentTint, color: COLOR.accent },
  ghost: { background: 'transparent', color: COLOR.textMuted },
  outline: { background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className, style, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn('ecl-btn ecl-press inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium', className)}
      style={{ ...VARIANT_STYLE[variant], ...style }}
    >
      {children}
    </button>
  );
});
