import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { api } from '@/api/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FullScreenSpinner } from '@/components/ui/spinner';
import { getQueryKey, PAGE_SIZES, QUERY_KEY_TYPES } from '@/consts';
import { Button } from '@/components/ui/button';
import { LeaderList } from './leaders-list';

export const LeaderBoard = () => {
  const [page, setPage] = useState(1);

  const {
    data: { data: leaders = [], total = 0 } = {},
    isPending,
    isFetching,
  } = useQuery({
    queryKey: getQueryKey({ type: QUERY_KEY_TYPES.USERS, payload: { page } }),
    queryFn: () =>
      api.auth.user.getMany({ page, limit: PAGE_SIZES[QUERY_KEY_TYPES.USERS] }),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const showPagination = total > PAGE_SIZES[QUERY_KEY_TYPES.USERS];

  if (isPending) {
    return <FullScreenSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Таблица лидеров</CardTitle>
        <CardDescription>Наши звёздочки ⭐</CardDescription>
      </CardHeader>
      <CardContent>
        {!!leaders && <LeaderList leaders={leaders} />}
        {showPagination && (
          <div className='flex justify-between items-center'>
            <Button
              disabled={page === 1}
              onClick={() => {
                setPage(p => p - 1);
              }}
              size='icon'
              variant='outline'
            >
              <ArrowLeftIcon />
            </Button>
            <span>
              Страница {page}
              {isFetching && ' • обновление…'}
            </span>
            <Button
              disabled={leaders.length < PAGE_SIZES[QUERY_KEY_TYPES.USERS]}
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
