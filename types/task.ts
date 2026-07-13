export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ['open', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  /** Nullable — a task can relate to a referral, a practice relationship, or neither. */
  referralId: string | null;
  practiceId: string | null;
  assignedToUserId: string;
  assignedToName: string;
  createdByUserId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskInsert = Omit<Task, 'id' | 'assignedToName' | 'createdAt' | 'updatedAt'>;
