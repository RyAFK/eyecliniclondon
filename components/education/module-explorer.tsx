'use client';

import { useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { SearchInput } from '@/components/ui/search-input';
import { FilterBar } from '@/components/ui/filter-bar';
import { EducationModuleCard } from '@/components/education/module-card';
import { EDUCATION_MODULE_CATEGORIES, type EducationModule, type EducationModuleCategory } from '@/types/education-module';

export function ModuleExplorer({ modules, completedModuleIds }: { modules: EducationModule[]; completedModuleIds: Set<string> }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EducationModuleCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modules.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (!q) return true;
      return m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    });
  }, [modules, search, category]);

  const completedCount = modules.filter((m) => completedModuleIds.has(m.id)).length;

  return (
    <div className="ecl-fade-up rounded-2xl p-6 sm:p-8" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <GraduationCap size={14} /> Clinical Education
          </p>
          <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            Referral pathway modules
          </h2>
        </div>
        <p className="text-sm" style={{ color: COLOR.textMuted }}>
          {completedCount} of {modules.length} completed
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-xs sm:flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search modules…" ariaLabel="Search clinical education modules" />
        </div>
        <FilterBar options={EDUCATION_MODULE_CATEGORIES} value={category} onChange={setCategory} allLabel="All topics" />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl p-6 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
          No modules match your search. Try a different term or topic.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <div key={m.id} className="ecl-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <EducationModuleCard module={m} completed={completedModuleIds.has(m.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
