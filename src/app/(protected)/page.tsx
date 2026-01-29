import { CategoriesBlock } from '@/components/widgets/categories-block';
import { TasksBlock } from '@/components/widgets/tasks-block';
import prisma from '@/server/db';

export default async function Home() {
  const [days, categories, tasks] = await Promise.all([
    prisma.day.findMany(),
    prisma.category.findMany(),
    prisma.task.findMany(),
  ]);

  return (
    <>
      <TasksBlock
        hasCategories={!!categories.length}
        hasDays={!!days.length}
        tasks={tasks}
      />
      <CategoriesBlock categories={categories} />
    </>
  );
}
