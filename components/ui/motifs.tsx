import { COLOR } from '@/lib/theme';

export function EyeMotif({ size = 220, tone }: { size?: number; tone?: string }) {
  const strokeTone = tone || COLOR.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="98" fill={COLOR.primaryTint} />
      <path d="M20 100c26-42 60-62 80-62s54 20 80 62c-26 42-60 62-80 62s-54-20-80-62Z" fill={COLOR.bg} stroke={COLOR.primary} strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="38" fill={COLOR.primary} />
      <circle cx="100" cy="100" r="38" fill="url(#irisGrad)" opacity="0.9" />
      <circle cx="100" cy="100" r="17" fill="#0A1420" />
      <circle cx="90" cy="90" r="6" fill="#FFFFFF" opacity="0.85" />
      <path d="M20 100c26-42 60-62 80-62s54 20 80 62" stroke={strokeTone} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" fill="none" />
      <defs>
        <radialGradient id="irisGrad" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0%" stopColor={COLOR.secondary} />
          <stop offset="100%" stopColor={COLOR.primary} />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function LensRings({ className = '', size = 160 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" className={className}>
      <circle cx="80" cy="80" r="78" stroke={COLOR.accent} strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="58" stroke={COLOR.accent} strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="38" stroke={COLOR.accent} strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}
