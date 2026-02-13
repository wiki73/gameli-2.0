'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';
import { ROUTES } from '@/src/consts';
import type { CategoryFormType } from '@lib/category';

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

export const getUserCategories = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      ratio: true,
      level: true,
      experience: true,
    },
    orderBy: { name: 'asc' },
  });

  return categories;
};

export const getCategoryById = async ({ id }: { id: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const category = await prisma.category.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};
