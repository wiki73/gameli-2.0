'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import type { Habit, HabitEntry } from '@/generated/prisma';

type Props = {
  habit: Habit & { entries: HabitEntry[] };
};

const MAX_HABIT_DAYS = 21;
const MAX_MULTIPLIER = 3;
const PERCENTAGE_DIVISOR = 100;
const MULTIPLIER_DECIMAL_PLACES = 2;
// const DAILY_MULTIPLIER_INCREASE = 1.05;

export const HabitXpStats = ({ habit }: Props) => {
  const maxPossibleXp = MAX_HABIT_DAYS * habit.baseXp * MAX_MULTIPLIER;
  const progressPercentage = Math.min(
    (habit.totalXp / maxPossibleXp) * PERCENTAGE_DIVISOR,
    PERCENTAGE_DIVISOR,
  );

  // const daysUntilMultiplierIncrease = 1;

  return (
    <Card className='mb-2 sm:mb-4'>
      <CardHeader className='px-3 pt-2 pb-1 sm:px-6 sm:pb-2'>
        <CardTitle className='flex items-center justify-between text-base sm:text-lg'>
          <span>Статистика</span>
          <span className='text-primary text-lg font-bold sm:text-2xl'>
            {habit.totalXp} XP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='px-3 pb-3 sm:px-6 sm:pb-4'>
        <div className='space-y-3 sm:space-y-4'>
          <div className='grid grid-cols-4 gap-1 sm:gap-3'>
            <div className='bg-primary/10 rounded-lg p-1 text-center sm:p-3'>
              <div className='text-primary text-xs font-bold sm:text-2xl'>
                ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </div>
              <div className='text-muted-foreground text-[8px] leading-tight sm:text-sm'>
                Множитель
              </div>
            </div>

            <div className='rounded-lg bg-amber-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-amber-700 sm:text-2xl'>
                {habit.currentStreak}
              </div>
              <div className='text-muted-foreground text-[8px] leading-tight sm:text-sm'>
                Стрик
              </div>
            </div>

            <div className='rounded-lg bg-red-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-red-700 sm:text-2xl'>
                {habit.bestStreak}
              </div>
              <div className='text-muted-foreground text-[8px] leading-tight sm:text-sm'>
                Лучший
              </div>
            </div>

            <div className='rounded-lg bg-blue-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-blue-700 sm:text-2xl'>
                {habit.baseXp}
              </div>
              <div className='text-muted-foreground text-[8px] leading-tight sm:text-sm'>
                База
              </div>
            </div>
          </div>

          <div className='space-y-1'>
            <div className='flex justify-between text-[10px] sm:text-sm'>
              <span>Прогресс</span>
              <span>
                {habit.totalXp} / {maxPossibleXp}
              </span>
            </div>
            <Progress
              className='h-1.5 sm:h-2'
              value={progressPercentage}
            />
          </div>

          <div className='text-muted-foreground border-t pt-2 text-[8px] sm:pt-3 sm:text-xs'>
            <p className='mb-1 font-medium sm:mb-2'>Как работает:</p>
            <ul className='space-y-0.5 sm:space-y-1'>
              <li className='flex items-center'>
                <span className='mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500 sm:h-2 sm:w-2' />
                <span>Дни подряд: +5% к множителю</span>
              </li>
              <li className='flex items-center'>
                <span className='mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500 sm:h-2 sm:w-2' />
                <span>Пропуск: -15%</span>
              </li>
              <li className='flex items-center'>
                <span className='mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500 sm:h-2 sm:w-2' />
                <span>XP = {habit.baseXp} × множитель</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
