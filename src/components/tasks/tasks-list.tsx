import type { Task } from '@/generated/prisma';
import { ScrollArea } from '../ui/scroll-area';
import { TaskItem } from './task';

type Props = {
  tasks: Task[];
};

export const TasksList = ({ tasks }: Props) => (
  <ScrollArea className='h-full'>
    <ul className='flex h-full max-h-46 w-full flex-col gap-2 '>
      {tasks.map(task => (
        <ul key={task.id}>
          <TaskItem task={task} />
        </ul>
      ))}
    </ul>
  </ScrollArea>
);
