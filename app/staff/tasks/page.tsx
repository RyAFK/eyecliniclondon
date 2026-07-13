import { requireStaff } from '@/lib/auth';
import { tasksService, usersService, practicesService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { TasksBoard } from '@/components/staff/tasks-board';

export default async function StaffTasksPage() {
  const user = await requireStaff();
  const [tasks, staffUsers, practices] = await Promise.all([
    tasksService.listTasks(user),
    usersService.listStaffUsers(user),
    practicesService.listPractices(user),
  ]);

  return (
    <>
      <h1 className="ecl-fade-up text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Tasks
      </h1>
      <div className="mt-6">
        <TasksBoard tasks={tasks} staffUsers={staffUsers} practices={practices} />
      </div>
    </>
  );
}
