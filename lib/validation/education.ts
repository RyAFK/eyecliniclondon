import { z } from 'zod';

export const submitKnowledgeCheckSchema = z.object({
  moduleId: z.string().trim().min(1).max(100),
  score: z.number().int().min(0).max(20),
  total: z.number().int().min(1).max(20),
});

export type SubmitKnowledgeCheckInput = z.infer<typeof submitKnowledgeCheckSchema>;
