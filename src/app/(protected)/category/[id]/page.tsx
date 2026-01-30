import prisma from '@/server/db';

export default async function CategoryPage({
  params,
}: PageProps<'/category/[id]'>) {
  const { id } = (await params) as { id: string };

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return <div>{category?.name}</div>;
}
