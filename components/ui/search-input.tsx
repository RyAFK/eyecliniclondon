'use client';

import { Search, X } from 'lucide-react';
import { COLOR } from '@/lib/theme';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: COLOR.textMuted }} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="focus:ring-2"
        style={{
          width: '100%',
          borderRadius: '0.625rem',
          border: `1px solid ${COLOR.border}`,
          background: COLOR.bg,
          padding: '0.625rem 2.5rem',
          fontSize: '15px',
          color: COLOR.text,
          outline: 'none',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="ecl-btn absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ color: COLOR.textMuted }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
