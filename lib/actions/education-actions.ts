'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { educationService } from '@/services';
import { submitKnowledgeCheckSchema } from '@/lib/validation/education';
import { EDUCATION_MODULES } from '@/lib/education-modules';

export interface SubmitKnowledgeCheckResult {
  error?: string;
}

/** Records completion of a Clinical Education Hub module's knowledge check. moduleId must match a real static module — never trust an arbitrary client-supplied id as "complete". */
export async function submitKnowledgeCheckAction(input: { moduleId: string; score: number; total: number }): Promise<SubmitKnowledgeCheckResult> {
  const user = await requireUser();
  try {
    const parsed = submitKnowledgeCheckSchema.parse(input);
    const moduleExists = EDUCATION_MODULES.some((m) => m.id === parsed.moduleId);
    if (!moduleExists) return { error: 'Unknown module.' };

    await educationService.recordModuleProgress(user, parsed.moduleId, parsed.score, parsed.total);
    revalidatePath('/dashboard/education');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not save your progress. Please try again.' };
  }
}
