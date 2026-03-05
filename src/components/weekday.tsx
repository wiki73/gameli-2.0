import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Calendar1Icon } from 'lucide-react';
import type { Task } from '@/generated/prisma';
import { cn } from '../lib/utils';
import { getFormattedDay } from '../lib/date';
import { getWeekdayColor } from '../consts';
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
  const color = getWeekdayColor(date);
  return (
    <Card
      className={cn(
        'border-card ring-card  max-h-80 min-h-80 w-full flex-1 gap-2 rounded-4xl ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:max-h-90 md:min-h-90',
        color?.ring,
        isToday && ['ring-4', color?.shadow],
      )}
    >
      <CardHeader className='flex justify-between'>
        <div>
          <CardTitle className='flex flex-row items-center gap-3 p-2'>
            <div className={cn('rounded-full p-3', color?.light)}>
              <Calendar1Icon
                className={color?.text}
                size={20}
              />
            </div>

            <div>
              <div className='font-semibold'>{title}</div>
              <div className='text-muted-foreground text-sm font-normal'>
                {getFormattedDay(date)}
              </div>
            </div>
          </CardTitle>
          <CardDescription>Количество задач: {tasksQuantity}</CardDescription>
        </div>

        {!!tasksQuantity && (
          <TaskCreateEditDialog
            date={date}
            mode='CREATE'
          />
        )}
      </CardHeader>

      <CardContent className='h-full'>
        {tasksQuantity ? (
          <TasksList tasks={tasks} />
        ) : (
          <Empty className='gap-1 p-2'>
            <EmptyMedia>
              <MagnifyingGlassIcon className='text-muted-foreground size-6' />
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
