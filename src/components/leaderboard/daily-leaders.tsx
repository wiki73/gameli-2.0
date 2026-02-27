'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Avatar } from '@/src/components/ui/avatar';
import { cn } from '@/src/lib/utils';
import { Badge } from '../ui/badge';

const TOP_LEADERS_COUNT = 3;
const START_POSITION = 4;
const MEDAL_FIRST = 0;
const MEDAL_SECOND = 1;
const MEDAL_THIRD = 2;

type User = {
  id: string;
  name: string;
  level: number;
  experience: number;
  dailyExperience: number | null;
  // image: string
};

type Props = {
  initialData: {
    leaders: User[];
    currentUser: User | null;
    date: Date;
  };
};

const MEDAL_COLORS = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-amber-600',
};

export const DailyLeaders = ({ initialData }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardContent className='flex min-h-200 items-center justify-center'>
          <div className='text-center'>Загрузка лидеров дня...</div>
        </CardContent>
      </Card>
    );
  }

  if (!initialData?.leaders.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrophyIcon className='size-5' />
            Лидеры дня
          </CardTitle>
          <CardDescription>
            Пока никто не получал опыт сегодня. Будьте первым! 🚀
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrophyIcon className='size-5' />
          Лидеры дня
        </CardTitle>
        <CardDescription>
          Самые активные пользователи за{' '}
          {new Date(initialData.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {initialData.leaders
            .slice(0, TOP_LEADERS_COUNT)
            .map((user, index) => (
              <div
                className={cn(
                  'flex items-center gap-4 rounded-lg p-3',
                  index === MEDAL_FIRST && 'bg-yellow-50 dark:bg-yellow-950/20',
                  index === MEDAL_SECOND && 'bg-gray-50 dark:bg-gray-800/20',
                  index === MEDAL_THIRD && 'bg-amber-50 dark:bg-amber-950/20',
                )}
                key={user.id}
              >
                <div
                  className={cn(
                    'text-2xl font-bold',
                    MEDAL_COLORS[(index + 1) as keyof typeof MEDAL_COLORS],
                  )}
                >
                  {index === MEDAL_FIRST
                    ? '🥇'
                    : index === MEDAL_SECOND
                      ? '🥈'
                      : '🥉'}
                </div>

                <Avatar className='h-10 w-10'>
                  {/* <AvatarImage src={user.image || undefined} /> */}
                </Avatar>

                <div className='flex-1'>
                  <div className='font-medium'>{user.name}</div>
                  <div className='text-sm text-gray-500'>
                    Уровень {user.level}
                  </div>
                </div>

                <Badge
                  className='text-sm'
                  variant='secondary'
                >
                  +{user.dailyExperience} XP
                </Badge>
              </div>
            ))}

          {initialData.leaders.length > TOP_LEADERS_COUNT && (
            <div className='mt-4 space-y-2'>
              {initialData.leaders
                .slice(TOP_LEADERS_COUNT)
                .map((user, index) => (
                  <div
                    className='flex items-center gap-4 p-2'
                    key={user.id}
                  >
                    <div className='w-8 text-center text-gray-500'>
                      {index + START_POSITION}
                    </div>

                    <Avatar className='h-8 w-8'>
                      {/* <AvatarImage src={user.image || undefined} /> */}
                    </Avatar>

                    <div className='flex-1'>
                      <span className='text-sm'>{user.name}</span>
                    </div>

                    <span className='text-sm text-gray-600'>
                      +{user.dailyExperience} XP
                    </span>
                  </div>
                ))}
            </div>
          )}

          {/* Текущий пользователь (если не в топе) */}
          {initialData.currentUser &&
            !initialData.leaders.some(
              l => l.id === initialData.currentUser?.id,
            ) &&
            (initialData.currentUser.dailyExperience ?? 0) > 0 && (
              <div className='mt-6 border-t pt-4'>
                <div className='mb-2 text-sm text-gray-500'>Ваше место</div>
                <div className='flex items-center gap-4 rounded-lg bg-blue-50 p-2 dark:bg-blue-950/20'>
                  <Avatar className='h-8 w-8'>
                    {/* <AvatarImage src={initialData.currentUser.image || undefined} /> */}
                  </Avatar>

                  <div className='flex-1'>
                    <span className='text-sm font-medium'>
                      {initialData.currentUser.name}
                    </span>
                  </div>

                  <Badge
                    className='text-sm'
                    variant='outline'
                  >
                    +{initialData.currentUser.dailyExperience} XP
                  </Badge>
                </div>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
