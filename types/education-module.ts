import type { TreatmentTypeId } from '@/types/referral';

/** Static content categories for the Clinical Education Hub — distinct from CPD events/clinic news (types/education.ts). */
export const EDUCATION_MODULE_CATEGORIES = ['Cataract', 'Refractive', 'Ocular Surface', 'Patient Care', 'Referral Pathways'] as const;
export type EducationModuleCategory = (typeof EDUCATION_MODULE_CATEGORIES)[number];

export interface KnowledgeCheckOption {
  id: string;
  label: string;
}

export interface KnowledgeCheckQuestion {
  id: string;
  question: string;
  options: KnowledgeCheckOption[];
  correctOptionId: string;
  /** Shown after answering, regardless of whether the answer was correct. */
  explanation: string;
}

export interface CaseStudyConsideration {
  id: string;
  label: string;
  detail: string;
}

export interface EducationModuleCaseStudy {
  scenario: string;
  prompt: string;
  considerations: CaseStudyConsideration[];
}

/**
 * A Clinical Education Hub module. Content is static/editorial (see
 * lib/education-modules.ts) — per-user completion state lives separately in
 * EducationModuleProgress so the same content works in demo and live mode.
 */
export interface EducationModule {
  id: string;
  slug: string;
  category: EducationModuleCategory;
  title: string;
  summary: string;
  estimatedMinutes: number;
  /** Nullable — no fabricated video links; set once a real recording exists. */
  videoUrl: string | null;
  overview: string[];
  keyLearningPoints: string[];
  caseStudy: EducationModuleCaseStudy;
  knowledgeCheck: KnowledgeCheckQuestion[];
  /** Pre-fills the referral wizard's treatment step from this module's "Refer a Patient" button, if relevant. */
  relatedTreatmentType: TreatmentTypeId | null;
  publishedAt: string;
}

export interface EducationModuleProgress {
  moduleId: string;
  userId: string;
  knowledgeCheckScore: number | null;
  knowledgeCheckTotal: number | null;
  completed: boolean;
  completedAt: string | null;
}
