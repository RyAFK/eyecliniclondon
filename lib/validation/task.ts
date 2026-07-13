import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types/task';

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).nullable(),
  priority: z.enum(TASK_PRIORITIES),
  status: z.enum(TASK_STATUSES),
  referralId: z.string().uuid().nullable(),
  practiceId: z.string().uuid().nullable(),
  assignedToUserId: z.string().uuid(),
  dueDate: z.string().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
