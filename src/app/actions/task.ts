'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';
import {
  DEFAUL_CATEGORY_RATIO,
  getExperience,
  getLevelByExperience,
  ROUTES,
  TIME,
} from '@/src/consts';
import type { TaskFormType } from '@/src/lib/task';
import { type Task, TaskStatus } from '@/generated/prisma';

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
    data: {
      ...data,
      userId: session.user.id,
      categoryId: categoryId || null,
      date,
    },
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
      description: data.description,
      categoryId: data.categoryId || null,
    },
  });

  revalidatePath(ROUTES.MAIN);
  return response;
};

export const deleteTask = async ({ id }: { id: string }) => {
  const response = await prisma.task.delete({
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
      status: TaskStatus.COMPLETED,
    },
  });

  revalidatePath(ROUTES.TASK);

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

  revalidatePath(ROUTES.TASK);

  return response;
};

export const pauseTimerTask = async ({
  id,
  timeSpent,
  status,
}: {
  id: string;
  timeSpent: number;
  status: TaskStatus;
}) => {
  const response = await prisma.task.update({
    where: { id },
    data: {
      status,
      timeSpent,
      ...(status === 'IN_PROGRESS' && { startedAt: new Date() }),
    },
  });

  revalidatePath(ROUTES.TASK);
  return response;
};

export const completeTimerTask = async ({
  task,
  timeSpent,
}: {
  task: Task;
  timeSpent: number;
}) => {
  // Получаем коэффициент категории
  const ratio = task.categoryId
    ? (
        await prisma.category.findUnique({
          where: { id: task.categoryId },
        })
      )?.ratio
    : DEFAUL_CATEGORY_RATIO;

  // Рассчитываем полученный опыт
  const experience = getExperience(timeSpent, ratio);

  let currentExperience = undefined;
  let categoryLevel = undefined;
  let categoryName = undefined;

  // Обновляем категорию (если есть)
  if (task.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: task.categoryId },
      select: { experience: true, level: true, name: true },
    });

    currentExperience = category?.experience;
    categoryLevel = category?.level;
    categoryName = category?.name;

    if (category && currentExperience !== undefined) {
      const newExperience = currentExperience + experience;
      const newLevel = getLevelByExperience(newExperience);

      await prisma.category.update({
        where: { id: task.categoryId },
        data: {
          experience: newExperience,
          level: newLevel,
        },
      });
    }
  }

  // Обновляем пользователя с dailyExperience
  const user = await prisma.user.findUnique({
    where: { id: task.userId },
    select: {
      experience: true,
      level: true,
      dailyExperience: true,
      lastDailyReset: true,
    },
  });

  if (user) {
    const newExperience = user.experience + experience;
    const newLevel = getLevelByExperience(newExperience);

    // Проверяем, нужно ли сбросить dailyExperience
    const today = new Date();
    const lastReset = user.lastDailyReset || new Date(0);
    const isNewDay = today.toDateString() !== lastReset.toDateString();

    const newDailyExperience = isNewDay
      ? experience
      : (user.dailyExperience || 0) + experience;

    await prisma.user.update({
      where: { id: task.userId },
      data: {
        experience: newExperience,
        level: newLevel,
        dailyExperience: newDailyExperience,
        lastDailyReset: isNewDay ? today : user.lastDailyReset,
      },
    });
  }

  // Завершаем задачу
  await prisma.task.update({
    where: { id: task.id },
    data: {
      status: 'COMPLETED',
      timeSpent,
    },
  });

  revalidatePath(ROUTES.MAIN);

  return {
    currentExp: currentExperience,
    addExperience: experience,
    level: categoryLevel,
    categoryName: categoryName,
  };
};
