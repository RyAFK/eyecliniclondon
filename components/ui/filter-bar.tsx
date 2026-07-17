'use client';

import { COLOR } from '@/lib/theme';

export function FilterBar<T extends string>({
  options,
  value,
  onChange,
  allLabel = 'All',
}: {
  options: readonly T[];
  value: T | 'all';
  onChange: (value: T | 'all') => void;
  allLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onChange('all')}
        aria-pressed={value === 'all'}
        className="ecl-btn ecl-press rounded-full px-3.5 py-1.5 text-sm font-medium"
        style={value === 'all' ? { background: COLOR.primary, color: '#fff' } : { background: COLOR.recessed, color: COLOR.textMuted }}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          className="ecl-btn ecl-press rounded-full px-3.5 py-1.5 text-sm font-medium"
          style={value === opt ? { background: COLOR.primary, color: '#fff' } : { background: COLOR.recessed, color: COLOR.textMuted }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
