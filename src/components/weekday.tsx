import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { Task } from '@/generated/prisma';
import { cn } from '../lib/utils';
import { getFormattedDay } from '../lib/date';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { TasksList } from './tasks/tasks-list';
import { TaskCreateEditDialog } from './tasks/task-create-edit-dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';

type Props = {
  title: string;
  tasks: Task[];
  isToday?: boolean;
  date: Date;
};

export const Weekday = ({ title, tasks, date, isToday = false }: Props) => {
  const tasksQuantity = tasks.length;

  return (
    <Card
      className={cn(
        'min-h-60 max-h-60 md:max-h-90 md:min-h-90 border-card ring-card w-full flex-1 rounded-4xl gap-2 ring-1',
        isToday && 'border-primary ring-primary ring-1',
      )}
    >
      <CardHeader className='flex justify-between'>
        <div>
        <CardTitle >
          {title} {getFormattedDay(date)}
        </CardTitle>
        <CardDescription>Количество задач: {tasksQuantity}</CardDescription>
        </div>
        <TaskCreateEditDialog
            date={date}
            mode='CREATE'
          />
      </CardHeader>
      <CardContent className='h-full'>
        {tasksQuantity ? (
          <TasksList tasks={tasks} />
        ) : (
          <Empty className=' gap-0 p-2'>
            <EmptyMedia >
              <MagnifyingGlassIcon className='size-6' />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Задач нет</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку ниже, чтобы создать новую задачу
              </EmptyDescription>
              <EmptyContent>
                <TaskCreateEditDialog
                  date={date}
                  mode='CREATE'
                />
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    
    </Card>
  );
};
