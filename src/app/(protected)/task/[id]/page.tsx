import { Cross1Icon } from '@radix-ui/react-icons';
import { TaskTimer } from '@/src/components/task-timer';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty';
import prisma from '@/src/server/db';

export default async function TaskPage({ params }: PageProps<'/task/[id]'>) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    return (
      <Empty>
        <EmptyMedia>
          <Cross1Icon className='size-8' />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Задача не найдена</EmptyTitle>
          <EmptyDescription>
            Попробуйте поискать что-нибудь еще
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='fixed  inset-0 flex items-center justify-center sm: p-3'>
      <TaskTimer task={task} />
    </div>
  );
}
