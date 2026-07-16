import { useColors } from '../../theme/colors';

export function NavigationItem({ icon: Icon, label, isActive, variant, onClick }) {
  const COLOR = useColors();

  if (variant === 'primary') {
    return (
      <li>
        <button
          onClick={onClick}
          className="ecl-btn ecl-press flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold"
          style={{ background: COLOR.accent, color: COLOR.primary }}
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </button>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        className="ecl-focus-ring flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-150"
        style={{
          background: isActive ? COLOR.primaryTint : 'transparent',
          color: isActive ? COLOR.text : COLOR.textMuted,
          borderLeft: `3px solid ${isActive ? COLOR.accent : 'transparent'}`,
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = COLOR.hoverBg; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} style={{ color: isActive ? COLOR.accent : COLOR.textMuted }} />
        {label}
      </button>
    </li>
  );
}
