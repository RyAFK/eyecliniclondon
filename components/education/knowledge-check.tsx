'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, HelpCircle, Loader2, RotateCcw, XCircle } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { submitKnowledgeCheckAction } from '@/lib/actions/education-actions';
import type { KnowledgeCheckQuestion } from '@/types/education-module';

export function KnowledgeCheck({
  moduleId,
  questions,
  alreadyCompleted,
  initialScore,
}: {
  moduleId: string;
  questions: KnowledgeCheckQuestion[];
  alreadyCompleted: boolean;
  initialScore: number | null;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(alreadyCompleted);
  // Score from the CURRENT answer set, once submitted this session. On a fresh
  // page load of an already-completed module there are no live answers to
  // score, so fall back to the persisted score rather than showing 0/N.
  const [submittedScore, setSubmittedScore] = useState<number | null>(alreadyCompleted ? initialScore : null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const allAnswered = questions.every((q) => answers[q.id]);
  const liveScore = questions.filter((q) => answers[q.id] === q.correctOptionId).length;

  function submit() {
    if (!allAnswered) return;
    setError('');
    startTransition(async () => {
      const result = await submitKnowledgeCheckAction({ moduleId, score: liveScore, total: questions.length });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
      setSubmittedScore(liveScore);
    });
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    setSubmittedScore(null);
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
      <h3 className="flex items-center gap-2 text-lg" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        <HelpCircle size={18} style={{ color: COLOR.secondary }} /> Knowledge check
      </h3>
      <p className="mt-1 text-sm" style={{ color: COLOR.textMuted }}>
        {questions.length} quick questions — completing them marks this module as done on your progress.
      </p>

      <div className="mt-5 space-y-6">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          return (
            <div key={q.id}>
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                {qi + 1}. {q.question}
              </p>
              <div className="mt-2.5 space-y-2">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isCorrect = opt.id === q.correctOptionId;
                  let borderColor: string = COLOR.border;
                  let bg: string = COLOR.bg;
                  if (submitted && isSelected) {
                    borderColor = isCorrect ? COLOR.complete : COLOR.problem;
                    bg = isCorrect ? '#2F7D5A14' : '#B3261E14';
                  } else if (submitted && isCorrect) {
                    borderColor = COLOR.complete;
                  } else if (!submitted && isSelected) {
                    borderColor = COLOR.primary;
                    bg = COLOR.primaryTint;
                  }
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                      className="ecl-btn flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm"
                      style={{ border: `1px solid ${borderColor}`, background: bg, color: COLOR.text }}
                    >
                      {opt.label}
                      {submitted && isSelected && (isCorrect ? <CheckCircle2 size={16} style={{ color: COLOR.complete }} /> : <XCircle size={16} style={{ color: COLOR.problem }} />)}
                      {submitted && !isSelected && isCorrect && <CheckCircle2 size={16} style={{ color: COLOR.complete }} />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="ecl-fade-in mt-2 text-xs leading-relaxed" style={{ color: COLOR.textMuted }}>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm" style={{ color: COLOR.problem }}>
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allAnswered || pending}
            className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: COLOR.primary, opacity: !allAnswered || pending ? 0.6 : 1 }}
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Submit answers
          </button>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.text }}>
              <CheckCircle2 size={16} style={{ color: COLOR.complete }} />
              {submittedScore === null ? 'Module marked complete' : `Scored ${submittedScore} of ${questions.length} · module marked complete`}
            </p>
            <button onClick={retake} className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium" style={{ color: COLOR.textMuted }}>
              <RotateCcw size={12} /> Retake
            </button>
          </>
        )}
      </div>
    </div>
  );
}
