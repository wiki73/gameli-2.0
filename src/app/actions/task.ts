'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';
import { ROUTES } from '@/src/consts';
import type { TaskFormType } from '@/src/lib/task';

export const createTask = async ({
  data,
  categoryId,
}: {
  data: TaskFormType;
  categoryId: string;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  const response = await prisma.task.create({
    data: { ...data, userId: session.user.id, categoryId },
  });
  revalidatePath(ROUTES.MAIN);

  return response;
};

export const updateTask = async ({
  id,
  data,
}: {
  id: string;
  data: TaskFormType;
}) => {
  const response = await prisma.task.update({
    where: { id },
    data: {
      name: data.name,
    },
  });

  revalidatePath(ROUTES.MAIN);

  return response;
};

export const deleteTask = async ({ id }: { id: string }) => {
  const response = await prisma.category.delete({
    where: { id },
  });

  revalidatePath(ROUTES.MAIN);

  return response;
};
