'use client';

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { COLOR } from '@/lib/theme';

export function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    borderRadius: '0.625rem',
    border: `1px solid ${COLOR.border}`,
    background: COLOR.bg,
    padding: '0.625rem 0.875rem',
    fontSize: '15px',
    color: COLOR.text,
    outline: 'none',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
  };
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  { style, className, ...props },
  ref
) {
  return <input ref={ref} {...props} style={{ ...inputStyle(), ...style }} className={`focus:ring-2 ${className ?? ''}`} />;
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { style, ...props },
  ref
) {
  return <textarea ref={ref} {...props} style={{ ...inputStyle(), minHeight: 80, resize: 'vertical', ...style }} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { style, children, ...props },
  ref
) {
  return (
    <select ref={ref} {...props} style={{ ...inputStyle(), ...style }}>
      {children}
    </select>
  );
});
