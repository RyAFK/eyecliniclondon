import { useColors, FONT_DISPLAY } from '../../theme/colors';

export function EclWordmark({ tone = 'dark', size = 'md', className = '' }) {
  const COLOR = useColors();
  const textColor = tone === 'white' ? '#FFFFFF' : COLOR.primary;
  const sizes = { sm: { icon: 22, font: '15px' }, md: { icon: 26, font: '17px' }, lg: { icon: 34, font: '22px' } };
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none" className="shrink-0">
        <circle cx="20" cy="20" r="19" stroke={tone === 'white' ? '#FFFFFF' : COLOR.primary} strokeOpacity={tone === 'white' ? 0.5 : 0.25} />
        <path d="M4 20c5.5-8 12-12 16-12s10.5 4 16 12c-5.5 8-12 12-16 12S9.5 28 4 20Z" fill="none" stroke={tone === 'white' ? '#FFFFFF' : COLOR.primary} strokeWidth="1.6" />
        <circle cx="20" cy="20" r="6.2" fill={COLOR.accent} />
        <circle cx="20" cy="20" r="2.6" fill={tone === 'white' ? COLOR.primary : '#FFFFFF'} />
      </svg>
      <span style={{ ...FONT_DISPLAY, color: textColor, fontSize: s.font, lineHeight: 1 }}>
        Eye Clinic <span style={{ color: COLOR.accent }}>London</span>
      </span>
    </span>
  );
}
