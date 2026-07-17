import { GraduationCap } from 'lucide-react';
import { requirePartner } from '@/lib/auth';
import { educationService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings } from '@/components/ui/motifs';
import { ModuleExplorer } from '@/components/education/module-explorer';
import { CpdNewsSection } from '@/components/education/cpd-news-section';
import { EDUCATION_MODULES } from '@/lib/education-modules';

export default async function EducationPage() {
  const user = await requirePartner();
  const [resources, progress] = await Promise.all([educationService.listEducationResources(), educationService.listModuleProgress(user)]);
  const completedModuleIds = new Set(progress.filter((p) => p.completed).map((p) => p.moduleId));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <GraduationCap size={14} /> Education &amp; Resources
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            Clinical education, CPD &amp; clinic news
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">Everything referring partners need to stay up to date with Eye Clinic London.</p>
        </div>
      </div>

      <div className="mt-6">
        <ModuleExplorer modules={EDUCATION_MODULES} completedModuleIds={completedModuleIds} />
      </div>

      <CpdNewsSection resources={resources} />
    </div>
  );
}
