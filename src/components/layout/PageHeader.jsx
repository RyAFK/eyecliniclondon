import { useColors, FONT_DISPLAY } from '../../theme/colors';

export function PageHeader({ eyebrow, title, description, actions }) {
  const COLOR = useColors();
  return (
    <div className="ecl-fade-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl sm:text-3xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
