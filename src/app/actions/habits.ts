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
      total_xp: 0,
      current_streak: 0,
      best_streak: 0,
      multiplier: 1.0,
      base_xp: 10, // мб потом поменяю
      last_completed_day: 0,
    },
  });

  const entriesData = Array.from({ length: 21 }, (_, i) => ({
    habit_id: habit.id,
    user_id: session.user.id,
    day_number: i + 1,
    completed: false,
    completed_at: null,
    xp_earned: 0,
  }));

  await prisma.habitEntry.createMany({
    data: entriesData,
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
  await prisma.habitEntry.deleteMany({
    where: { habit_id: id },
  });

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
    where: {
      habit_id: habitId,
      day_number: dayNumber,
      user_id: userId,
    },
  });

  if (!entry) {
    throw new Error('Entry not found');
  }

  const updatedEntry = await prisma.habitEntry.update({
    where: { id: entry.id },
    data: {
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
  });

  if (completed) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (habit) {
      const xpEarned = Math.round(habit.base_xp * habit.multiplier);

      await prisma.habitEntry.update({
        where: { id: entry.id },
        data: { xp_earned: xpEarned },
      });

      await prisma.habit.update({
        where: { id: habitId },
        data: {
          total_xp: habit.total_xp + xpEarned,
        },
      });

      // Добавляем опыт пользователю. не файт что это дожно быть в этом файле
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { experience: true, level: true },
      });

      if (user) {
        const newExperience = user.experience + xpEarned;
        const newLevel = getLevelByExperience(newExperience);

        await prisma.user.update({
          where: { id: userId },
          data: {
            experience: newExperience,
            level: newLevel,
          },
        });
      }

      const today = new Date().getDate();
      if (habit.last_completed_day === today - 1) {
        const newStreak = habit.current_streak + 1;
        await prisma.habit.update({
          where: { id: habitId },
          data: {
            current_streak: newStreak,
            best_streak: Math.max(habit.best_streak, newStreak),
            last_completed_day: today,
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
            current_streak: 1,
            last_completed_day: today,
            multiplier: 1.1,
          },
        });
      }
    }
  } else {
    const xpToRemove = entry.xp_earned || 0;
    if (xpToRemove > 0) {
      const habit = await prisma.habit.findUnique({
        where: { id: habitId },
      });

      if (habit) {
        await prisma.habit.update({
          where: { id: habitId },
          data: {
            total_xp: Math.max(0, habit.total_xp - xpToRemove),
          },
        });

        await prisma.habitEntry.update({
          where: { id: entry.id },
          data: { xp_earned: 0 },
        });

        // Вычитаем опыт у пользователя. тоже не всё тут долно быть
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { experience: true, level: true },
        });

        if (user) {
          const newExperience = Math.max(0, user.experience - xpToRemove);
          const newLevel = getLevelByExperience(newExperience);

          await prisma.user.update({
            where: { id: userId },
            data: {
              experience: newExperience,
              level: newLevel,
            },
          });
        }
      }
    }

    revalidatePath(ROUTES.HABITS);
    return updatedEntry;
  }
};

export const getHabitsWithEntries = async (userId: string) =>
  await prisma.habit.findMany({
    where: { userId },
    include: {
      entries: {
        orderBy: { day_number: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
