import { CheckIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { PenBox } from 'lucide-react';
import type { Task } from '@/generated/prisma';
import { cn } from '@/src/lib/utils';
import { ROUTES } from '@/src/consts';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '../ui/item';
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
import { TaskCreateEditDialog } from './task-create-edit-dialog';

type Props = {
  task: Task;
};

export const TaskItem = ({ task }: Props) => (
  <Item className={cn('bg-secondary flex flex-row flex-nowrap border-3 p-2')}>
    <ItemHeader className='flex flex-row  items-center'>
      <div >
        <ItemTitle
          className={cn(
            task.status === 'COMPLETED' && 'text-muted-foreground line-through',
          )}
        >
          <div className='mr-1'>
            {task.status === 'COMPLETED' ? (
              <div className='bg-primary rounded-full p-2 text-white'>
                <CheckIcon />
              </div>
            ) : (
              <div className='rounded-full bg-amber-500 p-2 text-white'>
                <PenBox size={20} />
              </div>
            )}
          </div>
          {task.name}
        </ItemTitle>
        <ItemDescription>{task.description}</ItemDescription>
      </div>
      <TaskCreateEditDialog
        categoryId={task?.categoryId}
        mode='EDIT'
        task={task}
      />
    </ItemHeader>
    <ItemContent className='flex'>
      {task.status === 'COMPLETED' && <CheckIcon className='size-6' />}
      {task.status !== 'COMPLETED' && (
        <div className='flex items-center gap-2'>
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
                  <TaskEnterTimeDialog task={task} />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </ItemContent>
  </Item>
);
