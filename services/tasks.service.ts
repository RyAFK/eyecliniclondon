import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { getDemoStore } from '@/lib/demo/store';
import { DEMO_USERS } from '@/lib/demo/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskSchema } from '@/lib/validation/task';
import type { UserProfile } from '@/types/user';
import { isStaffRole } from '@/types/user';
import type { Task, TaskInsert } from '@/types/task';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['tasks']['Row'], assignedToName: string): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    referralId: row.referral_id,
    practiceId: row.practice_id,
    assignedToUserId: row.assigned_to_user_id,
    assignedToName,
    createdByUserId: row.created_by_user_id,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Staff-only — tasks are an internal ECL work list, not visible to partners. */
export async function listTasks(user: UserProfile): Promise<Task[]> {
  if (!isStaffRole(user.role)) return [];

  if (isDemoMode()) {
    return [...getDemoStore().tasks].sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('tasks').select('*, profiles!tasks_assigned_to_user_id_fkey(full_name)').order('due_date');
  if (error) throw error;
  return (data ?? []).map((row: any) => mapRow(row, row.profiles?.full_name ?? 'Unassigned'));
}

export async function createTask(user: UserProfile, input: Omit<TaskInsert, 'createdByUserId'>): Promise<Task> {
  if (!isStaffRole(user.role)) throw new Error('Only Eye Clinic London staff can create tasks.');
  const parsed = taskSchema.parse(input);
  const now = new Date().toISOString();

  if (isDemoMode()) {
    const store = getDemoStore();
    const assignee = DEMO_USERS.find((u) => u.id === parsed.assignedToUserId);
    const task: Task = {
      id: crypto.randomUUID(),
      ...parsed,
      assignedToName: assignee?.fullName ?? 'Unassigned',
      createdByUserId: user.id,
      createdAt: now,
      updatedAt: now,
    };
    store.tasks.unshift(task);
    return task;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority,
      status: parsed.status,
      referral_id: parsed.referralId,
      practice_id: parsed.practiceId,
      assigned_to_user_id: parsed.assignedToUserId,
      due_date: parsed.dueDate,
      created_by_user_id: user.id,
    })
    .select('*, profiles!tasks_assigned_to_user_id_fkey(full_name)')
    .single();
  if (error) throw error;
  return mapRow(data as any, (data as any).profiles?.full_name ?? 'Unassigned');
}

export async function updateTaskStatus(user: UserProfile, taskId: string, status: Task['status']): Promise<Task> {
  if (!isStaffRole(user.role)) throw new Error('Only Eye Clinic London staff can update tasks.');

  if (isDemoMode()) {
    const store = getDemoStore();
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found.');
    task.status = status;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select('*, profiles!tasks_assigned_to_user_id_fkey(full_name)')
    .single();
  if (error) throw error;
  return mapRow(data as any, (data as any).profiles?.full_name ?? 'Unassigned');
}
