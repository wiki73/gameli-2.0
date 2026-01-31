import { CategoriesBlock } from '@components/categories/categories-block';
import prisma from '@server/db';

export default async function Home() {
  const [categories] = await Promise.all([
    prisma.category.findMany(),
    prisma.task.findMany(),
  ]);

  return <CategoriesBlock categories={categories} />;
}
