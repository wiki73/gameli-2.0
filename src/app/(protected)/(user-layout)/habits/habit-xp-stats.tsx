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
const DAILY_MULTIPLIER_INCREASE = 1.05;

export const HabitXpStats = ({ habit }: Props) => {
  const maxPossibleXp = MAX_HABIT_DAYS * habit.baseXp * MAX_MULTIPLIER;
  const progressPercentage = Math.min(
    (habit.totalXp / maxPossibleXp) * PERCENTAGE_DIVISOR,
    PERCENTAGE_DIVISOR,
  );

  const daysUntilMultiplierIncrease = 1;

  return (
    <Card className='mb-4'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center justify-between text-lg'>
          <span>Статистика привычки</span>
          <span className='text-primary text-2xl font-bold'>
            {habit.totalXp} XP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            <div className='bg-primary/10 rounded-lg p-3 text-center'>
              <div className='text-primary text-2xl font-bold'>
                ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </div>
              <div className='text-muted-foreground text-sm'>Множитель</div>
            </div>

            <div className='rounded-lg bg-amber-50 p-3 text-center'>
              <div className='text-2xl font-bold text-amber-700'>
                {habit.currentStreak}
              </div>
              <div className='text-muted-foreground text-sm'>Дней подряд</div>
              <div className='mt-1 text-xs text-amber-600'>
                {daysUntilMultiplierIncrease} до ×
                {(habit.multiplier * DAILY_MULTIPLIER_INCREASE).toFixed(
                  MULTIPLIER_DECIMAL_PLACES,
                )}
              </div>
            </div>

            <div className='rounded-lg bg-red-50 p-3 text-center'>
              <div className='text-2xl font-bold text-red-700'>
                {habit.bestStreak}
              </div>
              <div className='text-muted-foreground text-sm'>Лучший стрик</div>
            </div>

            <div className='rounded-lg bg-blue-50 p-3 text-center'>
              <div className='text-2xl font-bold text-blue-700'>
                {habit.baseXp}
              </div>
              <div className='text-muted-foreground text-sm'>База XP/день</div>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Накопленный опыт</span>
              <span>
                {habit.totalXp} / {maxPossibleXp} XP
              </span>
            </div>
            <Progress
              className='h-2'
              value={progressPercentage}
            />
          </div>
          <div className='text-muted-foreground border-t pt-3 text-sm'>
            <p className='mb-2 font-medium'>Как работает система:</p>
            <ul className='space-y-1'>
              <li className='flex items-center'>
                <span className='mr-2 inline-block h-2 w-2 rounded-full bg-green-500' />
                <span>
                  Каждый день подряд: <strong>+5% к множителю</strong> (до ×3.0)
                </span>
              </li>
              <li className='flex items-center'>
                <span className='mr-2 inline-block h-2 w-2 rounded-full bg-red-500' />
                <span>
                  Пропуск дня: <strong>-15% к множителю</strong> (минимум ×1.0)
                </span>
              </li>
              <li className='flex items-center'>
                <span className='mr-2 inline-block h-2 w-2 rounded-full bg-blue-500' />
                <span>
                  XP за день: <strong>{habit.baseXp} × множитель</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
