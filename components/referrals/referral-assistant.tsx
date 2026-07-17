'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, MessageCircleQuestion, RotateCcw, Sparkles, UserPlus } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Field } from '@/components/ui/field';
import { TextArea } from '@/components/ui/inputs';
import { treatmentName } from '@/types/referral';
import {
  AGE_RANGES,
  AGE_RANGE_LABELS,
  CURRENT_CORRECTIONS,
  CURRENT_CORRECTION_LABELS,
  EMPTY_ASSISTANT_ANSWERS,
  NEAR_VISION_EXPECTATIONS,
  NEAR_VISION_EXPECTATION_LABELS,
  VISUAL_CONCERNS,
  VISUAL_CONCERN_LABELS,
  suggestPathway,
  type AgeRange,
  type AssistantResult,
  type CurrentCorrection,
  type NearVisionExpectation,
  type ReferralAssistantAnswers,
  type VisualConcern,
} from '@/lib/referral-assistant';

interface OptionCardsProps<T extends string> {
  options: readonly T[];
  labels: Record<T, string>;
  value: T | null;
  onSelect: (value: T) => void;
}

function OptionCards<T extends string>({ options, labels, value, onSelect }: OptionCardsProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className="ecl-lift ecl-press rounded-xl p-3.5 text-left text-sm font-medium"
            style={{ border: `1px solid ${selected ? COLOR.primary : COLOR.border}`, background: selected ? COLOR.primaryTint : COLOR.bg, color: COLOR.text }}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}

function YesNoUnsure({ value, onSelect }: { value: boolean | null; onSelect: (value: boolean | null) => void }) {
  const options: { label: string; val: boolean | null }[] = [
    { label: 'Yes', val: true },
    { label: 'No', val: false },
    { label: 'Not sure', val: null },
  ];
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map(({ label, val }) => {
        const selected = value === val;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(val)}
            className="ecl-lift ecl-press rounded-xl px-5 py-2.5 text-sm font-medium"
            style={{ border: `1px solid ${selected ? COLOR.primary : COLOR.border}`, background: selected ? COLOR.primaryTint : COLOR.bg, color: COLOR.text }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

interface Step {
  title: string;
  subtitle: string;
  render: (answers: ReferralAssistantAnswers, set: (patch: Partial<ReferralAssistantAnswers>) => void) => React.ReactNode;
  canContinue: (answers: ReferralAssistantAnswers) => boolean;
}

const STEPS: Step[] = [
  {
    title: 'Patient age range',
    subtitle: 'A general range is enough — exact age is not required.',
    render: (a, set) => <OptionCards options={AGE_RANGES} labels={AGE_RANGE_LABELS} value={a.ageRange} onSelect={(v: AgeRange) => set({ ageRange: v })} />,
    canContinue: (a) => a.ageRange !== null,
  },
  {
    title: 'Main visual concern',
    subtitle: 'What is the patient’s primary complaint?',
    render: (a, set) => <OptionCards options={VISUAL_CONCERNS} labels={VISUAL_CONCERN_LABELS} value={a.mainConcern} onSelect={(v: VisualConcern) => set({ mainConcern: v })} />,
    canContinue: (a) => a.mainConcern !== null,
  },
  {
    title: 'Current spectacle or contact lens use',
    subtitle: 'How is the patient currently corrected, if at all?',
    render: (a, set) => (
      <OptionCards options={CURRENT_CORRECTIONS} labels={CURRENT_CORRECTION_LABELS} value={a.currentCorrection} onSelect={(v: CurrentCorrection) => set({ currentCorrection: v })} />
    ),
    canContinue: (a) => a.currentCorrection !== null,
  },
  {
    title: 'Cataract diagnosis or symptoms',
    subtitle: 'Has a cataract been diagnosed, or are symptoms suggestive of one (e.g. clouded/blurred vision, faded colours, glare at night)?',
    render: (a, set) => <YesNoUnsure value={a.cataractSymptoms} onSelect={(v) => set({ cataractSymptoms: v })} />,
    canContinue: () => true,
  },
  {
    title: 'Refractive error',
    subtitle: 'Does the patient have a known refractive error (short-sight, long-sight, or astigmatism)?',
    render: (a, set) => <YesNoUnsure value={a.hasRefractiveError} onSelect={(v) => set({ hasRefractiveError: v })} />,
    canContinue: () => true,
  },
  {
    title: 'Near-vision expectations',
    subtitle: 'How does the patient feel about wearing reading glasses long-term?',
    render: (a, set) => (
      <OptionCards
        options={NEAR_VISION_EXPECTATIONS}
        labels={NEAR_VISION_EXPECTATION_LABELS}
        value={a.nearVisionExpectation}
        onSelect={(v: NearVisionExpectation) => set({ nearVisionExpectation: v })}
      />
    ),
    canContinue: (a) => a.nearVisionExpectation !== null,
  },
  {
    title: 'Previous eye surgery',
    subtitle: 'Has the patient had any previous eye surgery?',
    render: (a, set) => <YesNoUnsure value={a.previousEyeSurgery} onSelect={(v) => set({ previousEyeSurgery: v })} />,
    canContinue: () => true,
  },
  {
    title: 'Relevant known eye conditions',
    subtitle: 'Optional — e.g. dry eye, keratoconus, glaucoma. Leave blank if none.',
    render: (a, set) => (
      <Field label="Known eye conditions (optional)">
        <TextArea value={a.knownConditions} onChange={(e) => set({ knownConditions: e.target.value })} placeholder="e.g. long-standing dry eye" />
      </Field>
    ),
    canContinue: () => true,
  },
  {
    title: 'Are you uncertain which pathway applies?',
    subtitle: 'If you’re not sure which service is right for this patient, say so — we’ll suggest discussing the case directly with Ryan or the clinical team instead of guessing.',
    render: (a, set) => (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl p-4" style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={a.uncertainAboutPathway} onChange={(e) => set({ uncertainAboutPathway: e.target.checked })} />
        <span className="text-sm" style={{ color: COLOR.text }}>
          Yes, I&rsquo;m uncertain which referral pathway best fits this patient.
        </span>
      </label>
    ),
    canContinue: () => true,
  },
];

export function ReferralAssistant() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<ReferralAssistantAnswers>(EMPTY_ASSISTANT_ANSWERS);
  const [result, setResult] = useState<AssistantResult | null>(null);

  function set(patch: Partial<ReferralAssistantAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function startAgain() {
    setAnswers(EMPTY_ASSISTANT_ANSWERS);
    setStepIndex(0);
    setResult(null);
  }

  if (result) {
    const canRefer = result.pathway !== 'discuss';
    return (
      <div className="ecl-fade-in space-y-6">
        <div className="ecl-fade-up rounded-2xl p-6" style={{ background: COLOR.primaryTint, border: `1px solid ${COLOR.border}` }}>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.secondary }}>
            <Sparkles size={14} /> Suggested next step
          </p>
          <h2 className="mt-2 text-xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            {result.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.text }}>
            {result.explanation}
          </p>
        </div>

        <div className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '60ms', background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
          <p className="flex items-center gap-2 text-sm font-medium" style={{ color: COLOR.text }}>
            <AlertTriangle size={15} style={{ color: COLOR.action }} /> Important limitations
          </p>
          <ul className="mt-2 space-y-1.5 text-sm" style={{ color: COLOR.textMuted }}>
            {result.limitations.map((l) => (
              <li key={l}>&bull; {l}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          {canRefer && (
            <Link
              href={`/dashboard/refer?treatment=${result.pathway}&source=referral_assistant`}
              className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: COLOR.primary }}
            >
              <UserPlus size={16} /> Refer This Patient
            </Link>
          )}
          <a
            href="mailto:ryan@eyecliniclondon.com?subject=Referral%20pathway%20question"
            className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
            style={{ background: COLOR.accentTint, color: COLOR.accent }}
          >
            <MessageCircleQuestion size={16} /> Discuss This Case
          </a>
          <Link
            href="/dashboard/education"
            className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
            style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}
          >
            View Service Information
          </Link>
          <button
            onClick={startAgain}
            className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
            style={{ background: 'transparent', color: COLOR.textMuted }}
          >
            <RotateCcw size={15} /> Start Again
          </button>
        </div>

        {canRefer && (
          <p className="text-xs" style={{ color: COLOR.textMuted }}>
            You can change the referral pathway before submitting — this suggestion pre-fills{' '}
            <strong style={{ color: COLOR.text }}>{treatmentName(result.pathway)}</strong> but is not fixed.
          </p>
        )}
      </div>
    );
  }

  const step = STEPS[stepIndex]!;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="ecl-fade-in space-y-6">
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i <= stepIndex ? COLOR.accent : COLOR.border, transition: 'background 300ms ease' }} />
        ))}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
          Question {stepIndex + 1} of {STEPS.length}
        </p>
        <h2 className="mt-1 text-xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
          {step.title}
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: COLOR.textMuted }}>
          {step.subtitle}
        </p>
      </div>

      <div key={stepIndex} className="ecl-fade-in">
        {step.render(answers, set)}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => (stepIndex === 0 ? router.push('/dashboard') : setStepIndex((s) => s - 1))}
          className="ecl-btn flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium"
          style={{ color: COLOR.textMuted }}
        >
          <ArrowLeft size={16} /> {stepIndex === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={() => {
            if (!step.canContinue(answers)) return;
            if (isLast) {
              setResult(suggestPathway(answers));
            } else {
              setStepIndex((s) => s + 1);
            }
          }}
          disabled={!step.canContinue(answers)}
          className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: COLOR.primary, opacity: step.canContinue(answers) ? 1 : 0.5 }}
        >
          {isLast ? 'Get suggestion' : 'Continue'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
