'use client';

import { useEffect, useState, useTransition } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getLeaderboard } from '@/src/app/actions/user';
import { LeaderList } from './leaders-list';

const PAGE_SIZE = 10;

type User = {
  id: string;
  name: string;
  level: number;
  experience: number;
  image: string | null;
};

type LeaderboardData = {
  users: User[];
  total: number;
  totalPages: number;
};

type Props = {
  initialData: LeaderboardData;
};

export const LeaderBoard = ({ initialData }: Props) => {
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<LeaderboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (page === 1) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await getLeaderboard({ page, limit: PAGE_SIZE });
        setData(result);
      } finally {
        setIsLoading(false);
      }
    });
  }, [page]);

  const showPagination = data.totalPages > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Таблица лидеров</CardTitle>
        <CardDescription>Наши звёздочки ⭐</CardDescription>
      </CardHeader>
      <CardContent>
        {data.users.length > 0 ? (
          <LeaderList leaders={data.users} />
        ) : (
          <p className='py-8 text-center text-gray-500'>Нет данных</p>
        )}

        {showPagination && (
          <div className='mt-6 flex items-center justify-between'>
            <Button
              disabled={page === 1 || isPending || isLoading}
              onClick={() => {
                setPage(p => p - 1);
              }}
              size='icon'
              variant='outline'
            >
              <ArrowLeftIcon />
            </Button>

            <span className='text-sm text-gray-600'>
              Страница {page} из {data.totalPages}
              {(isPending || isLoading) && ' • загрузка…'}
            </span>

            <Button
              disabled={page === data.totalPages || isPending || isLoading}
              onClick={() => {
                setPage(p => p + 1);
              }}
              size='icon'
              variant='outline'
            >
              <ArrowRightIcon />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
