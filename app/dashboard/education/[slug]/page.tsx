import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3, ListChecks, Mail, UserPlus } from 'lucide-react';
import { requirePartner } from '@/lib/auth';
import { educationService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Pill } from '@/components/ui/pill';
import { CaseStudy } from '@/components/education/case-study';
import { KnowledgeCheck } from '@/components/education/knowledge-check';
import { DownloadGuideButton } from '@/components/education/download-guide-button';
import { getEducationModuleBySlug, EDUCATION_MODULES } from '@/lib/education-modules';

export default async function EducationModulePage({ params }: { params: { slug: string } }) {
  const user = await requirePartner();
  const mod = getEducationModuleBySlug(params.slug);
  if (!mod) notFound();

  const progress = await educationService.listModuleProgress(user);
  const own = progress.find((p) => p.moduleId === mod.id);

  const related = EDUCATION_MODULES.filter((m) => m.id !== mod.id && m.category === mod.category).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/dashboard/education" className="ecl-underline mb-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.textMuted }}>
        <ArrowLeft size={15} /> Back to Clinical Education
      </Link>

      <div className="ecl-fade-up rounded-2xl p-6 sm:p-8" style={{ background: COLOR.primary }}>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">{mod.category}</Pill>
          <span className="flex items-center gap-1 text-xs text-white/70">
            <Clock3 size={12} /> {mod.estimatedMinutes} min
          </span>
        </div>
        <h1 className="mt-3 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
          {mod.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/70">{mod.summary}</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <h2 className="text-lg" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            Overview
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: COLOR.text }}>
            {mod.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 sm:p-6" style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}>
          <h2 className="flex items-center gap-2 text-lg" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            <ListChecks size={18} style={{ color: COLOR.secondary }} /> Key learning points
          </h2>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: COLOR.text }}>
            {mod.keyLearningPoints.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: COLOR.accent }}>&bull;</span> {p}
              </li>
            ))}
          </ul>
        </div>

        <CaseStudy caseStudy={mod.caseStudy} />

        <KnowledgeCheck moduleId={mod.id} questions={mod.knowledgeCheck} alreadyCompleted={own?.completed ?? false} initialScore={own?.knowledgeCheckScore ?? null} />

        <div className="rounded-2xl p-5 sm:p-6" style={{ background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
          <h2 className="text-base font-medium" style={{ color: COLOR.text }}>
            Next steps
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: COLOR.textMuted }}>
            Have a patient in mind, or want to talk it through first?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={mod.relatedTreatmentType ? `/dashboard/refer?treatment=${mod.relatedTreatmentType}` : '/dashboard/refer'}
              className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: COLOR.primary }}
            >
              <UserPlus size={16} /> Refer a Patient <ArrowRight size={14} />
            </Link>
            <a
              href={`mailto:ryan@eyecliniclondon.com?subject=${encodeURIComponent(`Discuss a case — ${mod.title}`)}`}
              className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
              style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}
            >
              <Mail size={16} /> Book a conversation with Ryan
            </a>
            <DownloadGuideButton module={mod} />
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-medium" style={{ color: COLOR.text }}>
              Related modules
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/education/${r.slug}`}
                  className="ecl-lift rounded-xl p-4 text-sm font-medium"
                  style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
