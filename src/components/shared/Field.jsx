import { useColors } from '../../theme/colors';

export function Field({ label, children, hint }) {
  const COLOR = useColors();
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: COLOR.text }}>
        {label}
        {hint && <span className="ml-1 font-normal" style={{ color: COLOR.textMuted }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}
