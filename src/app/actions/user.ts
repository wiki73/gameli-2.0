'use server';

import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';

const DEFAULT_DAILY_LIMIT = 5;
const RESET_HOUR = 0;
const RESET_MINUTE = 0;
const RESET_SECOND = 0;
const RESET_MILLISECOND = 0;
const DEFAULT_PAGE_SIZE = 10;

export const getDailyLeaders = async ({
  limit = DEFAULT_DAILY_LIMIT,
}: {
  limit?: number;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  const dayStart = new Date(today);
  dayStart.setHours(RESET_HOUR, RESET_MINUTE, RESET_SECOND, RESET_MILLISECOND);

  const usersToResert = await prisma.user.findMany({
    where: {
      lastDailyReset: {
        lt: dayStart,
      },
    },
    select: {
      id: true,
      lastDailyReset: true,
      dailyExperience: true,
    },
  });

  if (usersToResert.length > 0) {
    const yesteday = new Date(dayStart);
    yesteday.setDate(yesteday.getDate() - 1);

    const save = usersToResert.map(user => ({
      userId: user.id,
      experience: user.dailyExperience ?? 0,
      date: yesteday,
    }))
    await saveDailyStatsBatch(save)
  }

  await prisma.user.updateMany({
    where: {
      lastDailyReset: {
        lt: dayStart,
      },
    },
    data: {
      dailyExperience: 0,
      lastDailyReset: today,
    },
  });

  const dailyLeaders = await prisma.user.findMany({
    where: {
      dailyExperience: {
        gt: 0,
      },
    },
    select: {
      id: true,
      name: true,
      level: true,
      experience: true,
      dailyExperience: true,
      image: true,
    },
    orderBy: {
      dailyExperience: 'desc',
    },
    take: limit,
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      level: true,
      experience: true,
      dailyExperience: true,
      image: true,
    },
  });

  return {
    leaders: dailyLeaders,
    currentUser,
    date: today,
  };
};

export const getLeaderboard = async ({
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
}: {
  page?: number;
  limit?: number;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        experience: true,
      },
      orderBy: [{ level: 'desc' }, { experience: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.user.count({}),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
type DailyStatData = {
  userId: string;
  experience: number;
  date: Date;
};

export const saveDailyStat = async ({
  userId,
  experience,
  date,
}: DailyStatData) => {
  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0);

  try {
    const stat = await prisma.dailyStat.upsert({
      where: {
        userId_date: {
          userId,
          date: dayDate,
        },
      },
      update: {
        experience,
      },
      create: {
        userId,
        experience,
        date: dayDate,
      },
    });

    return { success: true, stat };
  } catch (error) {
    return { success: false, error };
  }
};

export const saveDailyStatsBatch = async (stats: DailyStatData[]) => {
  const results = [];

  for (const stat of stats) {
    const result = await saveDailyStat(stat);
    results.push(result);
  }

  return results;
};
