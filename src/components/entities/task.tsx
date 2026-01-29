import { PlayIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { TaskCreateEditDialog } from '@/components/pages/main/task-create-edit-dialog';
import type { Task } from '@/api/tasks/types';
import type { Day } from '@/api/days/types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/consts';
import { TaskDeleteDialog } from './task-delete-dialog';

type Props = {
  task: Task;
  selectedDay: Day;
  isBlocked: boolean;
  tasksPage: number;
  categoriesPage: number;
};

export const TaskItem = ({
  task,
  selectedDay,
  isBlocked,
  tasksPage,
  categoriesPage,
}: Props) => {
  const navigate = useNavigate();

  const handleGoTask = () => {
    navigate(
      `${ROUTES.TASK.replace(':taskId', task.id)}?tasksPage=${String(tasksPage)}&categoriesPage=${String(categoriesPage)}`,
    );
  };
  return (
    <Card
      className={cn(
        'flex flex-row items-center justify-between gap-1 py-4',
        task.is_done && 'opacity-50',
      )}
    >
      <CardHeader className='w-full pr-0 mb-auto'>
        <CardTitle
          className={cn(
            'h-full w-full line-clamp-3 text-sm',
            task.is_done && 'text-gray-500 line-through',
          )}
        >
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex items-center gap-1 pl-0 mt-auto'>
        {!task.is_done && !isBlocked && (
          <>
            <Button
              onClick={handleGoTask}
              size='icon'
            >
              <PlayIcon />
            </Button>
            <TaskCreateEditDialog
              modeForm='EDIT'
              page={tasksPage}
              selectedDay={selectedDay}
              task={task}
            />
          </>
        )}
        <TaskDeleteDialog
          dayId={selectedDay?.id}
          id={task.id}
          tasksPage={tasksPage}
        />
      </CardContent>
    </Card>
  );
};
