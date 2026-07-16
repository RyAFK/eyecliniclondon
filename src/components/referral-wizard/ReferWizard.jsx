import { useState, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Upload, FileText, X, Loader2,
} from 'lucide-react';
import { useColors, FONT_DISPLAY, FONT_MONO } from '../../theme/colors';
import { Field } from '../shared/Field';
import { TextInput, TextArea, makeInputStyle } from '../shared/TextInput';
import { TREATMENT_TYPES, TREATMENT_FEE_MAP, STEPS, CONSENT_TEXT } from '../../data/content';
import { ConfettiBurst } from './ConfettiBurst';

export function ReferWizard({ onExit, onSubmitReferral }) {
  const COLOR = useColors();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [patient, setPatient] = useState({ firstName: '', lastName: '', dob: '', email: '', phone: '', contactMethod: 'either', consent: false });
  const [treatmentId, setTreatmentId] = useState('');
  const [clinical, setClinical] = useState({ reason: '', symptoms: '', uva: '', bcva: '' });
  const [error, setError] = useState('');
  const [confetti, setConfetti] = useState(false);

  const treatment = TREATMENT_TYPES.find((t) => t.id === treatmentId);

  useEffect(() => {
    if (result) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [result]);

  useEffect(() => {
    if (!confetti) return;
    const t = setTimeout(() => setConfetti(false), 2600);
    return () => clearTimeout(t);
  }, [confetti]);

  function validateStep() {
    if (step === 0) {
      if (!patient.firstName || !patient.lastName || !patient.dob || !patient.phone) {
        setError('Please fill in the required patient details.');
        return false;
      }
      if (!patient.consent) {
        setError('Patient consent must be confirmed before continuing.');
        return false;
      }
    }
    if (step === 1 && !treatmentId) {
      setError('Select a treatment category to continue.');
      return false;
    }
    setError('');
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function submit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const reference = `ECL-2026-${String(Math.floor(Math.random() * 900000) + 100000).slice(0, 6)}`;
      setResult({
        reference,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      });
      setConfetti(true);
      onSubmitReferral?.({
        id: crypto.randomUUID(),
        patient: `${patient.firstName} ${patient.lastName}`.trim() || 'New patient',
        practice: 'Keith Holland Opticians',
        treatment: treatment?.name || 'General enquiry',
        status: 'Referral Received',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        fee: TREATMENT_FEE_MAP[treatmentId] || 100,
        reference,
      });
    }, 900);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <ConfettiBurst active={confetti} />
        <div className="ecl-pop mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: '#2F7D5A1A' }}>
          <CheckCircle2 size={32} style={{ color: COLOR.complete }} />
        </div>
        <h1 className="ecl-fade-up text-3xl" style={{ ...FONT_DISPLAY, color: COLOR.text, animationDelay: '100ms' }}>Referral submitted successfully</h1>
        <p className="ecl-fade-up mt-2" style={{ color: COLOR.textMuted, animationDelay: '160ms' }}>Eye Clinic London has received this referral and will be in touch.</p>

        <dl className="ecl-fade-up mt-8 grid grid-cols-2 gap-4 rounded-2xl p-6 text-left" style={{ animationDelay: '220ms', background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>Reference</dt>
            <dd className="mt-1 text-lg" style={FONT_MONO}>{result.reference}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>Submitted</dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>{result.date}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>Patient</dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>{patient.firstName} {patient.lastName.charAt(0)}.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>Treatment</dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>{treatment?.name}</dd>
          </div>
        </dl>

        <div className="ecl-fade-up mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: '280ms' }}>
          <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onExit(); }} className="ecl-btn ecl-press rounded-lg px-5 py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary }}>
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', background: COLOR.bg }}>
      <div style={{ borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bg }}>
        <div className="mx-auto max-w-3xl px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h2 style={{ ...FONT_DISPLAY, fontSize: '1.15rem', color: COLOR.text }}>
              Refer a patient · step {step + 1} of {STEPS.length}
            </h2>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onExit(); }}
              className="ecl-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ color: COLOR.textMuted, background: COLOR.recessed }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 999,
                  background: i <= step ? COLOR.accent : COLOR.border,
                  transition: 'background 350ms ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6">
        <div key={step} className="ecl-fade-in">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Patient details</h2>
              <p className="mt-1" style={{ color: COLOR.textMuted }}>Who are you referring to Eye Clinic London?</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="First name">
                <TextInput value={patient.firstName} onChange={(e) => setPatient({ ...patient, firstName: e.target.value })} />
              </Field>
              <Field label="Last name">
                <TextInput value={patient.lastName} onChange={(e) => setPatient({ ...patient, lastName: e.target.value })} />
              </Field>
              <Field label="Date of birth">
                <TextInput type="date" value={patient.dob} onChange={(e) => setPatient({ ...patient, dob: e.target.value })} />
              </Field>
              <Field label="Telephone">
                <TextInput type="tel" value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} />
              </Field>
              <Field label="Email address" hint="(optional)">
                <TextInput type="email" value={patient.email} onChange={(e) => setPatient({ ...patient, email: e.target.value })} />
              </Field>
              <Field label="Preferred contact method">
                <select style={makeInputStyle(COLOR)} value={patient.contactMethod} onChange={(e) => setPatient({ ...patient, contactMethod: e.target.value })}>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="either">Either</option>
                </select>
              </Field>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg p-4 transition-colors duration-200" style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={patient.consent} onChange={(e) => setPatient({ ...patient, consent: e.target.checked })} />
              <span className="text-sm" style={{ color: COLOR.text }}>{CONSENT_TEXT}</span>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Referral type</h2>
              <p className="mt-1" style={{ color: COLOR.textMuted }}>Choose the treatment category this referral relates to.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TREATMENT_TYPES.map(({ id, name, description, Icon }, i) => {
                const selected = treatmentId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTreatmentId(id)}
                    className="ecl-fade-up ecl-lift ecl-press flex items-start gap-3.5 rounded-2xl p-4 text-left transition-all"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      border: `1px solid ${selected ? COLOR.primary : COLOR.border}`,
                      background: selected ? COLOR.primaryTint : COLOR.bg,
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                      style={{ background: selected ? COLOR.primary : COLOR.recessed, color: selected ? '#fff' : COLOR.secondary }}
                    >
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block font-medium" style={{ color: COLOR.text }}>{name}</span>
                      <span className="mt-0.5 block text-sm" style={{ color: COLOR.textMuted }}>{description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Clinical information</h2>
              <p className="mt-1" style={{ color: COLOR.textMuted }}>Optional — add whatever you have to hand.</p>
            </div>
            <Field label="Reason for referral">
              <TextArea value={clinical.reason} onChange={(e) => setClinical({ ...clinical, reason: e.target.value })} />
            </Field>
            <Field label="Presenting symptoms">
              <TextArea value={clinical.symptoms} onChange={(e) => setClinical({ ...clinical, symptoms: e.target.value })} />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 rounded-2xl p-5" style={{ background: COLOR.recessed }}>
              <Field label="Unaided visual acuity">
                <TextInput style={{ ...FONT_MONO }} value={clinical.uva} onChange={(e) => setClinical({ ...clinical, uva: e.target.value })} />
              </Field>
              <Field label="Best corrected visual acuity">
                <TextInput style={{ ...FONT_MONO }} value={clinical.bcva} onChange={(e) => setClinical({ ...clinical, bcva: e.target.value })} />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Documents</h2>
              <p className="mt-1" style={{ color: COLOR.textMuted }}>Attach any relevant clinical documents — optional.</p>
            </div>
            <label
              className="ecl-lift flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl p-10 text-center"
              style={{ border: `2px dashed ${COLOR.border}` }}
            >
              <Upload size={28} strokeWidth={1.5} style={{ color: COLOR.secondary }} />
              <span className="font-medium" style={{ color: COLOR.text }}>Click to add files (preview only)</span>
              <span className="text-sm" style={{ color: COLOR.textMuted }}>PDF, JPG, PNG · up to 25MB each</span>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])}
              />
            </label>
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="ecl-fade-up flex items-center justify-between gap-3 rounded-lg p-3.5" style={{ border: `1px solid ${COLOR.border}` }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={20} style={{ color: COLOR.secondary }} />
                      <span className="truncate text-sm font-medium" style={{ color: COLOR.text }}>{f.name}</span>
                    </div>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ color: COLOR.textMuted }}>
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Review &amp; submit</h2>
              <p className="mt-1" style={{ color: COLOR.textMuted }}>Check everything looks right before sending.</p>
            </div>
            <section className="ecl-fade-up rounded-2xl p-5" style={{ border: `1px solid ${COLOR.border}` }}>
              <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>Patient</h3>
              <p className="text-sm" style={{ color: COLOR.text }}>{patient.firstName} {patient.lastName} · {patient.dob} · {patient.phone}</p>
            </section>
            <section className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '60ms', border: `1px solid ${COLOR.border}` }}>
              <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>Referral type</h3>
              <p className="text-sm" style={{ color: COLOR.text }}>{treatment?.name || '—'}</p>
            </section>
            <section className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '120ms', border: `1px solid ${COLOR.border}` }}>
              <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>Documents</h3>
              <p className="text-sm" style={{ color: COLOR.textMuted }}>{files.length === 0 ? 'No documents attached.' : `${files.length} file(s) attached.`}</p>
            </section>
          </div>
        )}
        </div>

        {error && (
          <p className="ecl-fade-in mt-6 rounded-lg p-3 text-sm" style={{ background: '#B3261E0D', border: `1px solid #B3261E4D`, color: COLOR.problem }}>
            {error}
          </p>
        )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLOR.border}`, background: COLOR.bg }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6">
          <button
            onClick={() => {
              if (step === 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onExit();
              } else {
                setStep((s) => s - 1);
              }
            }}
            className="ecl-btn flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{ color: COLOR.textMuted }}
          >
            <ArrowLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={goNext} className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary, opacity: submitting ? 0.7 : 1 }}>
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Submitting referral…' : 'Submit referral'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
