import { COLOR } from '@/lib/theme';

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: COLOR.text }}>
        {label}
        {hint && (
          <span className="ml-1 font-normal" style={{ color: COLOR.textMuted }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
