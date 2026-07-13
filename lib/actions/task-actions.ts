'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { tasksService } from '@/services';
import type { TaskPriority, TaskStatus } from '@/types/task';

export async function createTaskAction(input: {
  title: string;
  description: string | null;
  priority: TaskPriority;
  assignedToUserId: string;
  practiceId: string | null;
  referralId: string | null;
  dueDate: string | null;
}): Promise<{ error?: string }> {
  const user = await requireStaff();
  try {
    await tasksService.createTask(user, { ...input, status: 'open' });
    revalidatePath('/staff/tasks');
    revalidatePath('/staff');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not create task.' };
  }
}

export async function updateTaskStatusAction(taskId: string, status: TaskStatus): Promise<{ error?: string }> {
  const user = await requireStaff();
  try {
    await tasksService.updateTaskStatus(user, taskId, status);
    revalidatePath('/staff/tasks');
    revalidatePath('/staff');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not update task.' };
  }
}
