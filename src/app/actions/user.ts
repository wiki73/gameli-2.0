'use server';

import { headers } from 'next/headers';
import { auth } from '@server/auth';
import prisma from '@server/db';

const LIMIT = 10;

export const getLeaderboard = async ({
  page = 1,
  limit = LIMIT,
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
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
