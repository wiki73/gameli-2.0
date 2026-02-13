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
    where: {
      habitId: habitId,
      dayNumber: dayNumber,
      userId: userId,
    },
  });

  if (!entry) {
    throw new Error('Entry not found');
  }

  const updatedEntry = await prisma.habitEntry.update({
    where: { id: entry.id },
    data: {
      completedAt: completed ? new Date() : undefined,
    },
  });

  let xpEarned = 0;

  if (completed) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (habit) {
      xpEarned = Math.round(habit.baseXp * habit.multiplier);

      await prisma.habitEntry.update({
        where: { id: entry.id },
        data: { xpEarned },
      });

      await prisma.habit.update({
        where: { id: habitId },
        data: {
          totalXp: habit.totalXp + xpEarned,
        },
      });

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
      if (habit.lastCompletedDay === today - 1) {
        const newStreak = habit.currentStreak + 1;
        await prisma.habit.update({
          where: { id: habitId },
          data: {
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
            currentStreak: 1,
            lastCompletedDay: today,
            multiplier: 1.1,
          },
        });
      }
    }
  } else {
    const xpToRemove = entry.xpEarned || 0;
    if (xpToRemove > 0) {
      const habit = await prisma.habit.findUnique({
        where: { id: habitId },
      });

      if (habit) {
        await prisma.habit.update({
          where: { id: habitId },
          data: {
            totalXp: Math.max(0, habit.totalXp - xpToRemove),
          },
        });

        await prisma.habitEntry.update({
          where: { id: entry.id },
          data: { xpEarned: 0 },
        });

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
  }

  revalidatePath(ROUTES.HABITS);

  return { ...updatedEntry, xp_earned: xpEarned };
};

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
