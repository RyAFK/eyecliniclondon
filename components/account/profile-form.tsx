'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/inputs';
import { updateOwnProfileAction } from '@/lib/actions/profile-actions';
import type { NotificationPreferences } from '@/types/user';

const PREFERENCE_COPY: { key: keyof NotificationPreferences; label: string; hint: string }[] = [
  { key: 'referralUpdates', label: 'Referral updates', hint: 'Status changes on referrals you or your practice have submitted.' },
  { key: 'cpdInvitations', label: 'CPD invitations', hint: 'Invitations to Eye Clinic London CPD events.' },
  { key: 'clinicNews', label: 'Clinic news', hint: 'New services, clinic announcements and patient leaflets.' },
];

export function ProfileForm({ fullName, notificationPreferences }: { fullName: string; notificationPreferences: NotificationPreferences }) {
  const [name, setName] = useState(fullName);
  const [prefs, setPrefs] = useState<NotificationPreferences>(notificationPreferences);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  function save(next: { fullName?: string; notificationPreferences?: NotificationPreferences }) {
    setStatus('idle');
    setError('');
    startTransition(async () => {
      const result = await updateOwnProfileAction(next);
      if (result.error) {
        setError(result.error);
        setStatus('error');
      } else {
        setStatus('saved');
      }
    });
  }

  function togglePreference(key: keyof NotificationPreferences) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    save({ notificationPreferences: next });
  }

  return (
    <div className="space-y-6">
      <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <h2 className="mb-4 font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
          Your details
        </h2>
        <Field label="Full name">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} className="sm:flex-1" />
            <button
              onClick={() => save({ fullName: name })}
              disabled={pending || !name.trim() || name === fullName}
              className="ecl-btn ecl-press flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
              style={{ background: COLOR.primary, opacity: pending || !name.trim() || name === fullName ? 0.6 : 1 }}
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </Field>
        {status === 'saved' && (
          <p className="ecl-fade-in mt-2 flex items-center gap-1.5 text-xs" style={{ color: COLOR.complete }}>
            <CheckCircle2 size={13} /> Saved.
          </p>
        )}
        {status === 'error' && (
          <p className="ecl-fade-in mt-2 text-xs" style={{ color: COLOR.problem }}>
            {error}
          </p>
        )}
      </div>

      <div className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '60ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <h2 className="mb-1 font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
          Notification preferences
        </h2>
        <p className="mb-4 text-xs" style={{ color: COLOR.textMuted }}>
          Choose which notifications Eye Clinic London sends you. Referral status changes and account messages are never sent to third parties.
        </p>
        <ul className="divide-y" style={{ borderColor: COLOR.border }}>
          {PREFERENCE_COPY.map(({ key, label, hint }) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                  {label}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                  {hint}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={prefs[key]}
                aria-label={label}
                onClick={() => togglePreference(key)}
                disabled={pending}
                className="ecl-btn relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
                style={{ background: prefs[key] ? COLOR.primary : COLOR.border }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: prefs[key] ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
