import { toneBg, toneColor, type Tone } from '@/lib/theme';

export function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: toneBg(tone), color: toneColor(tone) }}>
      {children}
    </span>
  );
}
