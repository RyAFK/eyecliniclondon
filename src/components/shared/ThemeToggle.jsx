import { Sun, Moon } from 'lucide-react';
import { useColors } from '../../theme/colors';

export function ThemeToggle({ theme, onToggle, inline = false }) {
  const COLOR = useColors();
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle day / night view"
      className={`ecl-btn ecl-press flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${inline ? '' : 'fixed right-4 top-4 z-[70] shadow-md'}`}
      style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: theme === 'day' ? COLOR.secondary : COLOR.accent }}
    >
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
