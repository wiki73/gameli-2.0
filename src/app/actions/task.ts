'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';
import { ROUTES, TIME } from '@/src/consts';
import type { TaskFormType } from '@/src/lib/task';

export const createTask = async ({
  data,
  categoryId,
  date,
}: {
  data: TaskFormType;
  categoryId?: string;
  date?: Date;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  const response = await prisma.task.create({
    data: { ...data, userId: session.user.id, categoryId, date },
  });
  revalidatePath(ROUTES.CALENDAR);

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
    data,
  });

  revalidatePath(ROUTES.CALENDAR);

  return response;
};

export const deleteTask = async ({ id }: { id: string }) => {
  const response = await prisma.category.delete({
    where: { id },
  });

  revalidatePath(ROUTES.MAIN);

  return response;
};

export const enterTimeTask = async ({
  id,
  hours,
  minutes,
}: {
  id: string;
  hours: number;
  minutes: number;
}) => {
  const response = await prisma.task.update({
    where: { id },
    data: {
      timeSpent: minutes + hours * TIME.MINUTE_IN_HOUR,
      status: 'COMPLETED',
    },
  });

  revalidatePath(ROUTES.CALENDAR);

  return response;
};

export const startTimerTask = async ({ id }: { id: string }) => {
  const response = await prisma.task.update({
    where: { id },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      timeSpent: 0,
    },
  });

  revalidatePath(ROUTES.CALENDAR);

  return response;
};

export const pauseTimerTask = async ({
  id,
  timeSpent,
}: {
  id: string;
  timeSpent: number;
}) => {
  const response = await prisma.task.update({
    where: { id },
    data: {
      status: 'PAUSED',
      timeSpent,
    },
  });

  revalidatePath(ROUTES.CALENDAR);

  return response;
};
