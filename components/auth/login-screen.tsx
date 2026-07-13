'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ClipboardList, Loader2, Mail, Users2 } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { demoSignInPartnerAction, demoSignInStaffAction, type AuthActionState } from '@/lib/actions/auth-actions';
import { createClient } from '@/lib/supabase/client';

type Mode = 'role' | 'partner-signin' | 'sent' | 'staffcode' | 'otp-verify';

function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="mb-3">
        <circle cx="20" cy="20" r="19" stroke="#FFFFFF" strokeOpacity="0.5" />
        <path d="M4 20c5.5-8 12-12 16-12s10.5 4 16 12c-5.5 8-12 12-16 12S9.5 28 4 20Z" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="6.2" fill="#B08A4E" />
        <circle cx="20" cy="20" r="2.6" fill="#0B2545" />
      </svg>
      <p className="text-center text-white" style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.14em', lineHeight: 1.55 }}>
        EYE
        <br />
        CLINIC
        <br />
        LONDON
      </p>
    </div>
  );
}

const initialState: AuthActionState = {};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ecl-btn ecl-press flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
      style={{ background: COLOR.accent, color: COLOR.primary, opacity: pending ? 0.7 : 1 }}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function LoginScreen({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('role');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [liveError, setLiveError] = useState('');
  const [sending, setSending] = useState(false);

  const [partnerState, partnerFormAction] = useFormState(demoSignInPartnerAction, initialState);
  const [staffState, staffFormAction] = useFormState(demoSignInStaffAction, initialState);

  async function sendLiveOtp() {
    setLiveError('');
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
      if (error) throw error;
      setMode('otp-verify');
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : 'Could not send a sign-in code. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function verifyLiveOtp() {
    setLiveError('');
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (mode === 'role') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14" style={{ background: COLOR.primary }}>
        <BrandMark size={54} />
        <p className="mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Referral management
        </p>

        <div className="mt-8 w-full max-w-sm space-y-4">
          <button
            onClick={() => setMode('partner-signin')}
            className="ecl-btn ecl-press ecl-lift flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <div>
              <p className="text-base font-semibold text-white">Referring partner</p>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Sign in with a one-time email code
              </p>
            </div>
            <Users2 size={26} style={{ color: COLOR.accent }} className="shrink-0" />
          </button>

          <button
            onClick={() => setMode('staffcode')}
            className="ecl-btn ecl-press ecl-lift flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <div>
              <p className="text-base font-semibold text-white">Clinic team</p>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                BD dashboard · funnel · partners · fees
              </p>
            </div>
            <ClipboardList size={24} style={{ color: COLOR.accent }} className="shrink-0" />
          </button>
        </div>

        <p className="mt-8 max-w-xs text-center text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Referrals submitted by partners appear instantly on the clinic dashboard.
        </p>
      </div>
    );
  }

  if (mode === 'staffcode') {
    if (!demoMode) {
      return (
        <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
          <BrandMark size={44} />
          <h1 className="mt-6 text-2xl text-white" style={FONT_DISPLAY}>
            Clinic team access
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Staff sign in with their Eye Clinic London email using the same one-time code flow as referring partners.
          </p>
          <button onClick={() => setMode('partner-signin')} className="ecl-btn ecl-press mt-6 w-full max-w-sm rounded-xl py-3.5 text-sm font-semibold" style={{ background: COLOR.accent, color: COLOR.primary }}>
            Continue to sign-in
          </button>
          <button onClick={() => setMode('role')} className="ecl-underline mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            ← Back
          </button>
        </div>
      );
    }

    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
        <BrandMark size={44} />
        <h1 className="mt-6 text-2xl text-white" style={FONT_DISPLAY}>
          Clinic team access
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          This area is for Eye Clinic London staff. Enter the team code.
        </p>

        <form action={staffFormAction} className="mt-6 w-full max-w-sm space-y-3">
          <input
            type="text"
            name="code"
            autoCorrect="off"
            spellCheck="false"
            placeholder="Team code"
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              padding: '0.9rem 1rem',
              fontSize: '15px',
              textAlign: 'center',
              letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${staffState.error ? '#E88' : 'rgba(255,255,255,0.16)'}`,
              color: '#fff',
              outline: 'none',
            }}
          />
          {staffState.error && <p className="text-xs" style={{ color: '#F3A5A5' }}>{staffState.error}</p>}
          <SubmitButton>Enter</SubmitButton>
        </form>

        <button onClick={() => setMode('role')} className="ecl-underline mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back
        </button>
      </div>
    );
  }

  if (mode === 'partner-signin') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14" style={{ background: COLOR.primary }}>
        <BrandMark size={44} />
        <h1 className="mt-6 text-2xl text-white" style={FONT_DISPLAY}>
          Partner sign-in
        </h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          We&rsquo;ll email a one-time code to your practice address — no passwords.
        </p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              padding: '0.9rem 1rem',
              fontSize: '15px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: '#fff',
              outline: 'none',
            }}
          />
          {liveError && <p className="text-xs" style={{ color: '#F3A5A5' }}>{liveError}</p>}
          <button
            onClick={() => (demoMode ? setMode('sent') : sendLiveOtp())}
            disabled={!email || sending}
            className="ecl-btn ecl-press flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
            style={{ background: COLOR.accent, color: COLOR.primary, opacity: !email || sending ? 0.7 : 1 }}
          >
            {sending && <Loader2 size={16} className="animate-spin" />}
            Email me a sign-in code
          </button>
        </div>

        <button onClick={() => setMode('role')} className="ecl-underline mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back
        </button>
      </div>
    );
  }

  if (mode === 'otp-verify') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
        <BrandMark size={44} />
        <div className="ecl-pop mt-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(176,138,78,0.18)' }}>
          <Mail size={24} style={{ color: COLOR.accent }} />
        </div>
        <h1 className="mt-4 text-xl text-white" style={FONT_DISPLAY}>
          Enter your code
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          We&rsquo;ve sent a 6-digit code to {email}.
        </p>
        <div className="mt-6 w-full max-w-sm space-y-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code"
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              padding: '0.9rem 1rem',
              fontSize: '15px',
              textAlign: 'center',
              letterSpacing: '0.3em',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: '#fff',
              outline: 'none',
            }}
          />
          {liveError && <p className="text-xs" style={{ color: '#F3A5A5' }}>{liveError}</p>}
          <button
            onClick={verifyLiveOtp}
            disabled={otp.length !== 6 || sending}
            className="ecl-btn ecl-press flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
            style={{ background: COLOR.accent, color: COLOR.primary, opacity: otp.length !== 6 || sending ? 0.7 : 1 }}
          >
            {sending && <Loader2 size={16} className="animate-spin" />}
            Continue to dashboard
          </button>
        </div>
        <button onClick={() => setMode('role')} className="ecl-underline mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back
        </button>
      </div>
    );
  }

  // mode === 'sent' — demo mode only (see the branch above for live mode).
  return (
    <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
      <BrandMark size={44} />
      <div className="ecl-pop mt-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(176,138,78,0.18)' }}>
        <Mail size={24} style={{ color: COLOR.accent }} />
      </div>
      <h1 className="mt-4 text-xl text-white" style={FONT_DISPLAY}>
        Check your email
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Demo mode: no email is actually sent. Continue below to sign in as a sample referring practice.
      </p>
      <form action={partnerFormAction} className="mt-6 w-full max-w-sm space-y-3">
        <input type="hidden" name="email" value={email} />
        {partnerState.error && <p className="text-xs" style={{ color: '#F3A5A5' }}>{partnerState.error}</p>}
        <SubmitButton>Continue to dashboard</SubmitButton>
      </form>
      <button onClick={() => setMode('role')} className="ecl-underline mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
        ← Back
      </button>
    </div>
  );
}
