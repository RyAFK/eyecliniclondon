import { useColors } from '../../theme/colors';

export function makeInputStyle(C) {
  return {
    width: '100%',
    borderRadius: '0.625rem',
    border: `1px solid ${C.border}`,
    background: C.bg,
    padding: '0.625rem 0.875rem',
    fontSize: '15px',
    color: C.text,
    outline: 'none',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
  };
}

export function TextInput(props) {
  const COLOR = useColors();
  const base = makeInputStyle(COLOR);
  return <input {...props} style={{ ...base, ...(props.style || {}) }} className={`focus:ring-2 ${props.className || ''}`} />;
}

export function TextArea(props) {
  const COLOR = useColors();
  const base = makeInputStyle(COLOR);
  return <textarea {...props} style={{ ...base, minHeight: 80, resize: 'vertical', ...(props.style || {}) }} />;
}
