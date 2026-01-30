'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { ROUTES } from '@/consts';
import type { CategoryFormType } from '@/lib/category';
import { auth } from '@/server/auth';
import prisma from '@/server/db';

export const createCategory = async ({ data }: { data: CategoryFormType }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  const response = await prisma.category.create({
    data: { ...data, level: 1, experience: 0, userId: session.user.id },
  });
  revalidatePath(ROUTES.MAIN);

  return response;
};

export const updateCategory = async ({
  id,
  data,
}: {
  id: string;
  data: CategoryFormType;
}) => {
  const response = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      ratio: data.ratio,
    },
  });

  revalidatePath(ROUTES.MAIN);

  return response;
};

export const deleteCategory = async ({ id }: { id: string }) => {
  const response = await prisma.category.delete({
    where: { id },
  });

  revalidatePath(ROUTES.MAIN);

  return response;
};
