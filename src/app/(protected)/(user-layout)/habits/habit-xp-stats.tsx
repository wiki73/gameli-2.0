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
    <Card>
      <CardHeader className='px-3'>
        <CardTitle className='flex items-center justify-between text-base'>
          <span className=' text-2xl'>Статистика</span>
          <span className='text-primary text-lg font-bold sm:text-2xl'>
            {habit.totalXp} XP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='px-3'>
        <div className='space-y-2'>
          <div className='grid grid-cols-4 gap-1  '>
            <div className='bg-primary/10 rounded-lg p-1 flex flex-col justify-between py-3 text-center'>
              <div className='text-primary text-xs font-bold md:text-xl'>
                ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight md:text-xl'>
                Множитель
              </div>
            </div>

            <div className='rounded-lg bg-amber-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-amber-700 sm:text-2xl'>
                {habit.currentStreak}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight md:text-xl'>
                Стрик
              </div>
            </div>

            <div className='rounded-lg bg-red-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-red-700 sm:text-2xl'>
                {habit.bestStreak}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight md:text-xl'>
                Лучший
              </div>
            </div>

            <div className='rounded-lg bg-blue-50 p-1 text-center sm:p-3'>
              <div className='text-xs font-bold text-blue-700 sm:text-2xl'>
                {habit.baseXp}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight md:text-xl'>
                База
              </div>
            </div>
          </div>

          <div className='space-y-1'>
            <div className='flex justify-between text-[10px] md:text-xl'>
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

          <div className='text-muted-foreground border-t pt-2 text-[10px] md:text-xl'>
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
                <span className='mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500' />
                <span>XP = {habit.baseXp} × множитель</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
