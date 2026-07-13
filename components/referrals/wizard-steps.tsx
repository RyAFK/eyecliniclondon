'use client';

import { FileText, Upload, X } from 'lucide-react';
import { COLOR, FONT_MONO } from '@/lib/theme';
import { Field } from '@/components/ui/field';
import { TextInput, TextArea, Select } from '@/components/ui/inputs';
import { TREATMENT_TYPES, type PreferredContactMethod, type TreatmentTypeId } from '@/types/referral';
import * as Icons from 'lucide-react';

export interface PatientState {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  contactMethod: PreferredContactMethod;
  consent: boolean;
}

export interface ClinicalState {
  reason: string;
  symptoms: string;
  unaidedVisualAcuity: string;
  bestCorrectedVisualAcuity: string;
}

const TREATMENT_ICON: Record<string, keyof typeof Icons> = {
  cataract: 'Eye',
  rle: 'Sparkles',
  icl: 'ScanEye',
  lvc: 'Zap',
  cornea: 'CircleDot',
  dry_eye: 'Droplets',
  general: 'Stethoscope',
  other: 'MoreHorizontal',
};

export const CONSENT_TEXT =
  'I confirm that the patient is aware of this referral and that I am authorised to securely provide the information contained in this referral to Eye Clinic London.';

export function PatientDetailsStep({
  patient,
  onChange,
}: {
  patient: PatientState;
  onChange: (patient: PatientState) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: COLOR.text }}>
          Patient details
        </h2>
        <p className="mt-1" style={{ color: COLOR.textMuted }}>
          Who are you referring to Eye Clinic London?
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="First name">
          <TextInput value={patient.firstName} onChange={(e) => onChange({ ...patient, firstName: e.target.value })} autoComplete="off" />
        </Field>
        <Field label="Last name">
          <TextInput value={patient.lastName} onChange={(e) => onChange({ ...patient, lastName: e.target.value })} autoComplete="off" />
        </Field>
        <Field label="Date of birth">
          <TextInput type="date" value={patient.dob} onChange={(e) => onChange({ ...patient, dob: e.target.value })} max={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Telephone">
          <TextInput type="tel" value={patient.phone} onChange={(e) => onChange({ ...patient, phone: e.target.value })} autoComplete="off" />
        </Field>
        <Field label="Email address" hint="(optional)">
          <TextInput type="email" value={patient.email} onChange={(e) => onChange({ ...patient, email: e.target.value })} autoComplete="off" />
        </Field>
        <Field label="Preferred contact method">
          <Select value={patient.contactMethod} onChange={(e) => onChange({ ...patient, contactMethod: e.target.value as PreferredContactMethod })}>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="either">Either</option>
          </Select>
        </Field>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-lg p-4" style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0"
          checked={patient.consent}
          onChange={(e) => onChange({ ...patient, consent: e.target.checked })}
        />
        <span className="text-sm" style={{ color: COLOR.text }}>
          {CONSENT_TEXT}
        </span>
      </label>
    </div>
  );
}

export function ReferralTypeStep({ treatmentId, onSelect }: { treatmentId: TreatmentTypeId | ''; onSelect: (id: TreatmentTypeId) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: COLOR.text }}>
          Referral type
        </h2>
        <p className="mt-1" style={{ color: COLOR.textMuted }}>
          Choose the treatment category this referral relates to.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TREATMENT_TYPES.map(({ id, name, description }, i) => {
          const selected = treatmentId === id;
          const Icon = Icons[TREATMENT_ICON[id] ?? 'Eye'] as React.ComponentType<{ size?: number; strokeWidth?: number }>;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="ecl-fade-up ecl-lift ecl-press flex items-start gap-3.5 rounded-2xl p-4 text-left"
              style={{
                animationDelay: `${i * 40}ms`,
                border: `1px solid ${selected ? COLOR.primary : COLOR.border}`,
                background: selected ? COLOR.primaryTint : COLOR.bg,
              }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: selected ? COLOR.primary : COLOR.recessed, color: selected ? '#fff' : COLOR.secondary }}>
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <span>
                <span className="block font-medium" style={{ color: COLOR.text }}>
                  {name}
                </span>
                <span className="mt-0.5 block text-sm" style={{ color: COLOR.textMuted }}>
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ClinicalInfoStep({ clinical, onChange }: { clinical: ClinicalState; onChange: (c: ClinicalState) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: COLOR.text }}>
          Clinical information
        </h2>
        <p className="mt-1" style={{ color: COLOR.textMuted }}>
          Optional — add whatever you have to hand.
        </p>
      </div>
      <Field label="Reason for referral">
        <TextArea value={clinical.reason} onChange={(e) => onChange({ ...clinical, reason: e.target.value })} />
      </Field>
      <Field label="Presenting symptoms">
        <TextArea value={clinical.symptoms} onChange={(e) => onChange({ ...clinical, symptoms: e.target.value })} />
      </Field>
      <div className="grid grid-cols-1 gap-5 rounded-2xl p-5 sm:grid-cols-2" style={{ background: COLOR.recessed }}>
        <Field label="Unaided visual acuity">
          <TextInput style={FONT_MONO} value={clinical.unaidedVisualAcuity} onChange={(e) => onChange({ ...clinical, unaidedVisualAcuity: e.target.value })} />
        </Field>
        <Field label="Best corrected visual acuity">
          <TextInput style={FONT_MONO} value={clinical.bestCorrectedVisualAcuity} onChange={(e) => onChange({ ...clinical, bestCorrectedVisualAcuity: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

export function DocumentsStep({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: COLOR.text }}>
          Documents
        </h2>
        <p className="mt-1" style={{ color: COLOR.textMuted }}>
          Attach any relevant clinical documents — optional. Stored privately; never shared via a public link.
        </p>
      </div>
      <label className="ecl-lift flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl p-10 text-center" style={{ border: `2px dashed ${COLOR.border}` }}>
        <Upload size={28} strokeWidth={1.5} style={{ color: COLOR.secondary }} />
        <span className="font-medium" style={{ color: COLOR.text }}>
          Click to add files
        </span>
        <span className="text-sm" style={{ color: COLOR.textMuted }}>
          PDF, JPG, PNG · up to 25MB each
        </span>
        <input
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,image/heic"
          className="sr-only"
          onChange={(e) => onChange([...files, ...Array.from(e.target.files ?? [])])}
        />
      </label>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="ecl-fade-up flex items-center justify-between gap-3 rounded-lg p-3.5" style={{ border: `1px solid ${COLOR.border}` }}>
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={20} style={{ color: COLOR.secondary }} />
                <span className="truncate text-sm font-medium" style={{ color: COLOR.text }}>
                  {f.name}
                </span>
              </div>
              <button onClick={() => onChange(files.filter((_, j) => j !== i))} style={{ color: COLOR.textMuted }}>
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReviewStep({
  patient,
  treatmentName,
  fileCount,
}: {
  patient: PatientState;
  treatmentName: string;
  fileCount: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: COLOR.text }}>
          Review &amp; submit
        </h2>
        <p className="mt-1" style={{ color: COLOR.textMuted }}>
          Check everything looks right before sending.
        </p>
      </div>
      <section className="ecl-fade-up rounded-2xl p-5" style={{ border: `1px solid ${COLOR.border}` }}>
        <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
          Patient
        </h3>
        <p className="text-sm" style={{ color: COLOR.text }}>
          {patient.firstName} {patient.lastName} · {patient.dob} · {patient.phone}
        </p>
      </section>
      <section className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '60ms', border: `1px solid ${COLOR.border}` }}>
        <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
          Referral type
        </h3>
        <p className="text-sm" style={{ color: COLOR.text }}>
          {treatmentName || '—'}
        </p>
      </section>
      <section className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '120ms', border: `1px solid ${COLOR.border}` }}>
        <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
          Documents
        </h3>
        <p className="text-sm" style={{ color: COLOR.textMuted }}>
          {fileCount === 0 ? 'No documents attached.' : `${fileCount} file(s) attached.`}
        </p>
      </section>
    </div>
  );
}
