'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { COLOR, toneBg, toneColor, type Tone } from '@/lib/theme';
import { Field } from '@/components/ui/field';
import { TextInput, TextArea, Select } from '@/components/ui/inputs';
import { Pill } from '@/components/ui/pill';
import { Modal } from '@/components/ui/modal';
import { createTaskAction, updateTaskStatusAction } from '@/lib/actions/task-actions';
import { TASK_STATUSES } from '@/types/task';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';
import type { UserProfile } from '@/types/user';
import type { Practice } from '@/types/practice';
import { formatDate } from '@/lib/utils';

const PRIORITY_TONE: Record<TaskPriority, Tone> = { high: 'problem', medium: 'action', low: 'default' };
const STATUS_LABEL: Record<TaskStatus, string> = { open: 'Open', in_progress: 'In progress', done: 'Done' };

export function TasksBoard({ tasks, staffUsers, practices }: { tasks: Task[]; staffUsers: UserProfile[]; practices: Practice[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' as TaskPriority, assignedToUserId: staffUsers[0]?.id ?? '', practiceId: '', dueDate: '' });
  const [error, setError] = useState('');

  function handleCreate() {
    if (!form.title.trim() || !form.assignedToUserId) {
      setError('Title and assignee are required.');
      return;
    }
    startTransition(async () => {
      const res = await createTaskAction({
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        assignedToUserId: form.assignedToUserId,
        practiceId: form.practiceId || null,
        referralId: null,
        dueDate: form.dueDate || null,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setForm({ title: '', description: '', priority: 'medium', assignedToUserId: staffUsers[0]?.id ?? '', practiceId: '', dueDate: '' });
      router.refresh();
    });
  }

  function cycleStatus(task: Task) {
    const order: TaskStatus[] = ['open', 'in_progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length]!;
    startTransition(async () => {
      await updateTaskStatusAction(task.id, next);
      router.refresh();
    });
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium" style={{ color: COLOR.text }}>
          Tasks
        </h2>
        <button onClick={() => setOpen(true)} className="ecl-btn ecl-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white" style={{ background: COLOR.primary }}>
          <Plus size={15} /> New task
        </button>
      </div>

      <ul className="divide-y" style={{ borderColor: COLOR.border }}>
        {tasks.length === 0 && <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No tasks yet.</li>}
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: COLOR.text, textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
                {t.title}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                Assigned to {t.assignedToName}
                {t.dueDate ? ` · due ${formatDate(t.dueDate)}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Pill tone={PRIORITY_TONE[t.priority]}>{t.priority}</Pill>
              <button
                onClick={() => cycleStatus(t)}
                disabled={isPending}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: toneBg(t.status === 'done' ? 'complete' : t.status === 'in_progress' ? 'teal' : 'default'), color: toneColor(t.status === 'done' ? 'complete' : t.status === 'in_progress' ? 'teal' : 'default') }}
              >
                {STATUS_LABEL[t.status]}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', color: COLOR.text }}>New task</h3>
        <div className="mt-4 space-y-4">
          <Field label="Title">
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description" hint="(optional)">
            <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>
            <Field label="Due date" hint="(optional)">
              <TextInput type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Assigned to">
            <Select value={form.assignedToUserId} onChange={(e) => setForm({ ...form, assignedToUserId: e.target.value })}>
              {staffUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Related practice" hint="(optional)">
            <Select value={form.practiceId} onChange={(e) => setForm({ ...form, practiceId: e.target.value })}>
              <option value="">None</option>
              {practices.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          {error && (
            <p className="text-xs" style={{ color: COLOR.problem }}>
              {error}
            </p>
          )}
          <button onClick={handleCreate} disabled={isPending} className="ecl-btn ecl-press w-full rounded-lg py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary, opacity: isPending ? 0.7 : 1 }}>
            Create task
          </button>
        </div>
      </Modal>
    </div>
  );
}
