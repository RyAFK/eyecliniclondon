import { useState } from 'react';
import { Mail, Users2, ClipboardList } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { AccessOptionCard } from '../../components/access/AccessOptionCard';
import { DemoAccessPanel } from '../../components/access/DemoAccessPanel';
import { BrandMark } from './BrandMark';

export function LoginScreen({ onSignIn, onStaffSignIn }) {
  const COLOR = useColors();
  const [mode, setMode] = useState('role'); // role | signin | sent | staffcode
  const [email, setEmail] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [codeError, setCodeError] = useState('');

  function submitTeamCode() {
    if (teamCode.trim().toLowerCase() === 'ecl1234') {
      setCodeError('');
      onStaffSignIn();
    } else {
      setCodeError('Incorrect team code. Please try again.');
    }
  }

  if (mode === 'role') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14" style={{ background: COLOR.primary }}>
        <BrandMark size={54} />
        <p className="mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Referral management</p>

        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 lg:grid-cols-3">
          <AccessOptionCard
            title="Referring Partner"
            description="View patient referral progress, submit referrals, access clinical education and contact Ryan."
            Icon={Users2}
            buttonLabel="Partner Sign In"
            onClick={() => setMode('signin')}
          />
          <AccessOptionCard
            title="Clinic Team"
            description="Access referral reporting, partner analytics, tasks and internal clinic management tools."
            Icon={ClipboardList}
            buttonLabel="Clinic Team Sign In"
            onClick={() => setMode('staffcode')}
          />
          <DemoAccessPanel onViewPartnerDemo={onSignIn} onViewClinicDemo={onStaffSignIn} />
        </div>

        <p className="mt-8 max-w-xs text-center text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Referrals submitted by partners appear instantly on the clinic dashboard.
        </p>
      </div>
    );
  }

  if (mode === 'staffcode') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
        <BrandMark size={44} />
        <h1 className="mt-6 text-2xl text-white" style={FONT_DISPLAY}>Clinic team access</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          This area is for Eye Clinic London staff. Enter the team code.
        </p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          <label htmlFor="team-code" className="sr-only">Team code</label>
          <input
            id="team-code"
            type="text"
            autoCapitalize="sentences"
            autoCorrect="off"
            spellCheck="false"
            value={teamCode}
            onChange={(e) => { setTeamCode(e.target.value); setCodeError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && submitTeamCode()}
            placeholder="Team code"
            aria-invalid={!!codeError}
            aria-describedby={codeError ? 'team-code-error' : undefined}
            style={{
              width: '100%', borderRadius: '0.75rem', padding: '0.9rem 1rem', fontSize: '15px', textAlign: 'center', letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.08)', border: `1px solid ${codeError ? '#E88' : 'rgba(255,255,255,0.16)'}`, color: '#fff', outline: 'none',
            }}
          />
          {codeError && <p id="team-code-error" role="alert" className="text-xs" style={{ color: '#F3A5A5' }}>{codeError}</p>}
          <button
            onClick={submitTeamCode}
            className="ecl-btn ecl-press w-full rounded-xl py-3.5 text-sm font-semibold"
            style={{ background: COLOR.accent, color: COLOR.primary }}
          >
            Enter
          </button>
        </div>

        <button onClick={() => { setMode('role'); setTeamCode(''); setCodeError(''); }} className="ecl-underline mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back
        </button>
      </div>
    );
  }

  if (mode === 'signin') {
    return (
      <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14" style={{ background: COLOR.primary }}>
        <BrandMark size={44} />
        <h1 className="mt-6 text-2xl text-white" style={FONT_DISPLAY}>Partner sign-in</h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          We'll email a one-time code to your practice address — no passwords.
        </p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          <label htmlFor="partner-email" className="sr-only">Email address</label>
          <input
            id="partner-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            style={{
              width: '100%', borderRadius: '0.75rem', padding: '0.9rem 1rem', fontSize: '15px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', outline: 'none',
            }}
          />
          <button
            onClick={() => setMode('sent')}
            className="ecl-btn ecl-press w-full rounded-xl py-3.5 text-sm font-semibold"
            style={{ background: COLOR.accent, color: COLOR.primary }}
          >
            Email me a sign-in code
          </button>
        </div>

        <button
          onClick={onSignIn}
          className="ecl-btn ecl-press mt-4 w-full max-w-sm rounded-xl py-3 text-sm font-semibold text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          Bypass sign-in (preview)
        </button>

        <button onClick={() => setMode('role')} className="ecl-underline mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="ecl-fade-in flex min-h-[640px] flex-col items-center justify-center px-6 py-14 text-center" style={{ background: COLOR.primary }}>
      <BrandMark size={44} />
      <div className="ecl-pop mt-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(176,138,78,0.18)' }}>
        <Mail size={24} style={{ color: COLOR.accent }} />
      </div>
      <h1 className="mt-4 text-xl text-white" style={FONT_DISPLAY}>Check your email</h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        We've sent a one-time code to {email || 'your practice email'}. (Preview only — continue below.)
      </p>
      <button onClick={onSignIn} className="ecl-btn ecl-press mt-6 w-full max-w-sm rounded-xl py-3.5 text-sm font-semibold" style={{ background: COLOR.accent, color: COLOR.primary }}>
        Continue to dashboard
      </button>
      <button onClick={() => setMode('role')} className="ecl-underline mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
        ← Back
      </button>
    </div>
  );
}
