import { useColors } from '../../theme/colors';

export function Pill({ children, tone = 'default' }) {
  const COLOR = useColors();
  const tones = {
    default: { bg: COLOR.recessed, color: COLOR.textMuted },
    complete: { bg: '#2F7D5A1A', color: COLOR.complete },
    action: { bg: '#B4780E1A', color: COLOR.action },
    accent: { bg: COLOR.accentTint, color: COLOR.accent },
    info: { bg: '#1D4E751A', color: '#1D4E75' },
    purple: { bg: '#6D4AA31A', color: '#6D4AA3' },
    teal: { bg: '#0F766E1A', color: '#0F766E' },
    closed: { bg: '#78716C1A', color: '#78716C' },
  };
  const t = tones[tone] || tones.default;
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: t.bg, color: t.color }}>
      {children}
    </span>
  );
}
