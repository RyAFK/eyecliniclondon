import { useColors } from '../../theme/colors';

export function UserProfileSummary({ name, subtitle, initials }) {
  const COLOR = useColors();
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ background: COLOR.primary }}
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>{name}</p>
        <p className="truncate text-xs" style={{ color: COLOR.textMuted }}>{subtitle}</p>
      </div>
    </div>
  );
}
