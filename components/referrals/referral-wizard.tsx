'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { COLOR, FONT_DISPLAY, FONT_MONO } from '@/lib/theme';
import { ConfettiBurst } from '@/components/referrals/confetti-burst';
import { PatientDetailsStep, ReferralTypeStep, ClinicalInfoStep, DocumentsStep, ReviewStep, type PatientState, type ClinicalState } from '@/components/referrals/wizard-steps';
import { patientDetailsSchema, referralTypeSchema } from '@/lib/validation/referral';
import { treatmentName, type TreatmentTypeId } from '@/types/referral';
import { submitReferralAction } from '@/lib/actions/referral-actions';
import { formatDate } from '@/lib/utils';

const STEPS = ['Patient details', 'Referral type', 'Clinical information', 'Documents', 'Review & submit'];

// No prefilled patient data, ever — every field starts empty and consent starts false.
const EMPTY_PATIENT: PatientState = { firstName: '', lastName: '', dob: '', phone: '', email: '', contactMethod: 'either', consent: false };
const EMPTY_CLINICAL: ClinicalState = { reason: '', symptoms: '', unaidedVisualAcuity: '', bestCorrectedVisualAcuity: '' };

export function ReferralWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string; date: string } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [patient, setPatient] = useState<PatientState>(EMPTY_PATIENT);
  const [treatmentId, setTreatmentId] = useState<TreatmentTypeId | ''>('');
  const [clinical, setClinical] = useState<ClinicalState>(EMPTY_CLINICAL);
  const [error, setError] = useState('');
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (result) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [result]);

  useEffect(() => {
    if (!confetti) return;
    const t = setTimeout(() => setConfetti(false), 2600);
    return () => clearTimeout(t);
  }, [confetti]);

  function exit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push('/dashboard');
  }

  function validateStep(): boolean {
    if (step === 0) {
      const parsed = patientDetailsSchema.safeParse(patient);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? 'Please check the patient details.');
        return false;
      }
    }
    if (step === 1) {
      const parsed = referralTypeSchema.safeParse({ treatmentType: treatmentId });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? 'Select a treatment category to continue.');
        return false;
      }
    }
    setError('');
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    if (!validateStep() || !treatmentId) return;
    setSubmitting(true);
    setError('');

    const { referral, error: submitError } = await submitReferralAction({
      patientFirstName: patient.firstName,
      patientLastName: patient.lastName,
      patientDob: patient.dob,
      patientPhone: patient.phone,
      patientEmail: patient.email || null,
      preferredContactMethod: patient.contactMethod,
      patientConsent: patient.consent,
      treatmentType: treatmentId,
      referralReason: clinical.reason || null,
      presentingSymptoms: clinical.symptoms || null,
      unaidedVisualAcuity: clinical.unaidedVisualAcuity || null,
      bestCorrectedVisualAcuity: clinical.bestCorrectedVisualAcuity || null,
    });

    if (!referral || submitError) {
      setError(submitError ?? 'Could not submit this referral. Please try again.');
      setSubmitting(false);
      return;
    }

    if (files.length > 0) {
      await Promise.all(
        files.map((file) => {
          const body = new FormData();
          body.append('referralId', referral.id);
          body.append('file', file);
          return fetch('/api/upload', { method: 'POST', body }).catch(() => null);
        })
      );
    }

    setSubmitting(false);
    setResult({ reference: referral.reference, date: formatDate(referral.createdAt) });
    setConfetti(true);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <ConfettiBurst active={confetti} />
        <div className="ecl-pop mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: '#2F7D5A1A' }}>
          <CheckCircle2 size={32} style={{ color: COLOR.complete }} />
        </div>
        <h1 className="ecl-fade-up text-3xl" style={{ ...FONT_DISPLAY, color: COLOR.text, animationDelay: '100ms' }}>
          Referral submitted successfully
        </h1>
        <p className="ecl-fade-up mt-2" style={{ color: COLOR.textMuted, animationDelay: '160ms' }}>
          Eye Clinic London has received this referral and will be in touch.
        </p>

        <dl className="ecl-fade-up mt-8 grid grid-cols-2 gap-4 rounded-2xl p-6 text-left" style={{ animationDelay: '220ms', background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
              Reference
            </dt>
            <dd className="mt-1 text-lg" style={FONT_MONO}>
              {result.reference}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
              Submitted
            </dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>
              {result.date}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
              Patient
            </dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>
              {patient.firstName} {patient.lastName.charAt(0)}.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
              Treatment
            </dt>
            <dd className="mt-1 text-lg" style={{ color: COLOR.text }}>
              {treatmentName(treatmentId)}
            </dd>
          </div>
        </dl>

        <div className="ecl-fade-up mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: '280ms' }}>
          <button onClick={exit} className="ecl-btn ecl-press rounded-lg px-5 py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary }}>
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
            <button onClick={exit} className="ecl-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ color: COLOR.textMuted, background: COLOR.recessed }}>
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: i <= step ? COLOR.accent : COLOR.border, transition: 'background 350ms ease' }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6">
          <div key={step} className="ecl-fade-in">
            {step === 0 && <PatientDetailsStep patient={patient} onChange={setPatient} />}
            {step === 1 && <ReferralTypeStep treatmentId={treatmentId} onSelect={setTreatmentId} />}
            {step === 2 && <ClinicalInfoStep clinical={clinical} onChange={setClinical} />}
            {step === 3 && <DocumentsStep files={files} onChange={setFiles} />}
            {step === 4 && <ReviewStep patient={patient} treatmentName={treatmentId ? treatmentName(treatmentId) : ''} fileCount={files.length} />}
          </div>

          {error && (
            <p className="ecl-fade-in mt-6 rounded-lg p-3 text-sm" style={{ background: '#B3261E0D', border: '1px solid #B3261E4D', color: COLOR.problem }}>
              {error}
            </p>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLOR.border}`, background: COLOR.bg }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6">
          <button
            onClick={() => (step === 0 ? exit() : setStep((s) => s - 1))}
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
