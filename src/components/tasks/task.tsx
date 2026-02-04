import { CheckIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type { Task } from '@/generated/prisma';
import { cn } from '@/src/lib/utils';
import { ROUTES } from '@/src/consts';
import { Item, ItemHeader, ItemTitle } from '../ui/item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { TaskEnterTimeDialog } from './task-enter-time-dialog';

type Props = {
  task: Task;
};

export const TaskItem = ({ task }: Props) => (
  <Item
    className={cn(
      'border-border bg-secondary border',
      task.status === 'COMPLETED' && 'bg-muted opacity-50',
    )}
  >
    <ItemHeader>
      <ItemTitle
        className={cn(
          task.status === 'COMPLETED' && 'text-muted-foreground line-through',
        )}
      >
        {task.name}
      </ItemTitle>
      {task.status === 'COMPLETED' && <CheckIcon className='size-6' />}
      {task.status !== 'COMPLETED' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>Выполнение</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Начать</DropdownMenuLabel>
              <DropdownMenuItem disabled>Помодоро</DropdownMenuItem>
              <DropdownMenuItem disabled>Таймер</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={ROUTES.TASK.replace(':taskId', task.id)}>
                  На время
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuLabel>Завершить</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <TaskEnterTimeDialog taskId={task.id} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ItemHeader>
  </Item>
);
