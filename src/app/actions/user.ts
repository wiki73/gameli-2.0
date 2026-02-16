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
        image: true,
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
