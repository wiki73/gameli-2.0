import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import prisma from '@server/db';
import { Button } from '@ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { TasksList } from '@components/tasks/tasks-list';
import { ROUTES } from '@/src/consts';
import { TaskCreateEditDialog } from '@/src/components/tasks/task-create-edit-dialog';

export default async function CategoryPage({
  params,
}: PageProps<'/category/[id]'>) {
  const { id } = (await params) as { id: string };

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      categoryId: id,
    },
  });

  if (!category) {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <Card className='w-full max-w-xl'>
          <CardHeader>
            <CardTitle>Не найдена категория</CardTitle>
            <CardDescription>Попробуйте поискать еще раз</CardDescription>
            <CardAction>
              <Button
                asChild
                variant='outline'
              >
                <Link href={ROUTES.MAIN}>
                  <ArrowLeftIcon />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { name, description } = category;

  return (
    <div className='flex w-full flex-col'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button
              asChild
              variant='outline'
            >
              <Link href={ROUTES.MAIN}>
                <ArrowLeftIcon />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TasksList tasks={tasks} />
          <TaskCreateEditDialog categoryId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
