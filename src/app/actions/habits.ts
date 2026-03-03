'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';
import { getLevelByExperience, ROUTES } from '@/src/consts';
import type { HabitFormType } from '@/src/lib/habit';

const STREAK_MULTIPLIER_STEP = 0.1;
const MAX_MULTIPLIER = 3.0;

export const createHabit = async ({ data }: { data: HabitFormType }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const habit = await prisma.habit.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  await prisma.habitEntry.createMany({
    data: Array.from({ length: 21 }, (_, i) => ({
      habitId: habit.id,
      userId: session.user.id,
      dayNumber: i + 1,
      xpEarned: 0,
      completed: false,
    })),
  });

  revalidatePath(ROUTES.HABITS);
  return habit;
};

export const updateHabit = async ({
  id,
  data,
}: {
  id: string;
  data: HabitFormType;
}) => {
  const response = await prisma.habit.update({
    where: { id },
    data,
  });

  revalidatePath(ROUTES.HABITS);
  return response;
};

export const deleteHabit = async ({ id }: { id: string }) => {
  const response = await prisma.habit.delete({
    where: { id },
  });

  revalidatePath(ROUTES.HABITS);
  return response;
};

export const updateHabitEntry = async ({
  habitId,
  dayNumber,
  completed,
  userId,
}: {
  habitId: string;
  dayNumber: number;
  completed: boolean;
  userId: string;
}) => {
  const entry = await prisma.habitEntry.findFirst({
    where: { habitId, dayNumber, userId },
  });

  if (!entry) {
    throw new Error('Entry not found');
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit) {
    throw new Error('Habit not found');
  }

  let xpChange = 0;

  if (completed) {
    // ЛОГИКА ВЫПОЛНЕНИЯ (CHECK)
    xpChange = Math.round(habit.baseXp * habit.multiplier);

    const today = new Date().getDate();
    const isStreakContinued = habit.lastCompletedDay === today - 1;

    await habitUpdateWithStreak(
      habitId,
      habit,
      isStreakContinued,
      today,
      xpChange,
    );
  } else {
    // ЛОГИКА ОТМЕНЫ (UNCHECK)
    // Вычитаем ровно столько, сколько было заработано в этой записи ранее
    xpChange = -entry.xpEarned;

    await prisma.habit.update({
      where: { id: habitId },
      data: {
        totalXp: Math.max(0, habit.totalXp + xpChange),
        // При отмене привычки стрик обычно не сбрасывают мгновенно,
        // но если нужно — добавьте логику сброса здесь
      },
    });
  }

  // Обновляем саму запись
  const updatedEntry = await prisma.habitEntry.update({
    where: { id: entry.id },
    data: {
      completed: completed,
      completedAt: completed ? new Date() : null,
      xpEarned: completed ? xpChange : 0,
    },
  });

  // Обновляем пользователя
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { experience: true },
  });

  if (user) {
    const newExperience = Math.max(0, user.experience + xpChange);
    await prisma.user.update({
      where: { id: userId },
      data: {
        experience: newExperience,
        level: getLevelByExperience(newExperience),
      },
    });
  }

  revalidatePath(ROUTES.HABITS);
  return { ...updatedEntry, xp_earned: xpChange };
};

// Вспомогательная функция для чистоты кода
async function habitUpdateWithStreak(
  habitId: string,
  habit: any,
  isStreakContinued: boolean,
  today: number,
  xpChange: number,
) {
  if (isStreakContinued) {
    const newStreak = habit.currentStreak + 1;
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        totalXp: habit.totalXp + xpChange,
        currentStreak: newStreak,
        bestStreak: Math.max(habit.bestStreak, newStreak),
        lastCompletedDay: today,
        multiplier: Math.min(
          habit.multiplier + STREAK_MULTIPLIER_STEP,
          MAX_MULTIPLIER,
        ),
      },
    });
  } else {
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        totalXp: habit.totalXp + xpChange,
        currentStreak: 1,
        lastCompletedDay: today,
        multiplier: 1.1,
      },
    });
  }
}

export const getHabitsWithEntries = async (userId: string) =>
  await prisma.habit.findMany({
    where: { userId },
    include: {
      entries: {
        orderBy: { dayNumber: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
