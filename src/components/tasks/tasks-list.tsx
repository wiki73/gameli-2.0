import type { Task } from '@/generated/prisma';

type Props = {
  tasks: Task[];
};

export const TasksList = ({ tasks }: Props) => (
  <ul>
    {tasks.map(task => (
      <li key={task.id}>{task.name}</li>
    ))}
  </ul>
);
