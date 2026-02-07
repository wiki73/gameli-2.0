'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress'; // Проверьте, есть ли этот компонент
import type { Habit, HabitEntry } from '@/generated/prisma'; // Используем ваши типы

type Props = {
  habit: Habit & { entries: HabitEntry[] }; // Используем тот же тип, что и в HabitCard
};

// Добавляем константы для магических чисел
const MAX_HABIT_DAYS = 21;
const MAX_MULTIPLIER = 3;
const PERCENTAGE_DIVISOR = 100;
const MULTIPLIER_DECIMAL_PLACES = 2;
const DAILY_MULTIPLIER_INCREASE = 1.05; // +5%

export const HabitXpStats = ({ habit }: Props) => {
  // Рассчитываем прогресс опыта
  const maxPossibleXp = MAX_HABIT_DAYS * habit.base_xp * MAX_MULTIPLIER; // Максимум с множителем 3.0
  const progressPercentage = Math.min(
    (habit.total_xp / maxPossibleXp) * PERCENTAGE_DIVISOR,
    PERCENTAGE_DIVISOR,
  );

  // Рассчитываем сколько дней до след увеличения множителя
  const daysUntilMultiplierIncrease = 1; // Теперь КАЖДЫЙ день подряд

  // Если компонента Progress нет, создаем простую альтернативу
  if (!Progress) {
    return (
      <Card className='mb-4'>
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center justify-between text-lg'>
            <span>Статистика привычки</span>
            <span className='text-primary text-2xl font-bold'>
              {habit.total_xp} XP
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Показатели в карточках */}
            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              <div className='bg-primary/10 rounded-lg p-3 text-center'>
                <div className='text-primary text-2xl font-bold'>
                  ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
                </div>
                <div className='text-muted-foreground text-sm'>Множитель</div>
              </div>

              <div className='rounded-lg bg-amber-50 p-3 text-center'>
                <div className='text-2xl font-bold text-amber-700'>
                  {habit.current_streak}
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
                  {habit.best_streak}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Лучший стрик
                </div>
              </div>

              <div className='rounded-lg bg-blue-50 p-3 text-center'>
                <div className='text-2xl font-bold text-blue-700'>
                  {habit.base_xp}
                </div>
                <div className='text-muted-foreground text-sm'>
                  База XP/день
                </div>
              </div>
            </div>

            {/* Прогресс опыта - простой div если нет Progress компонента */}
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Накопленный опыт</span>
                <span>
                  {habit.total_xp} / {maxPossibleXp} XP
                </span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                <div
                  className='bg-primary h-full rounded-full transition-all duration-300'
                  style={{ width: `${String(progressPercentage)}%` }}
                />
              </div>
            </div>

            {/* Правила системы */}
            <div className='text-muted-foreground border-t pt-3 text-sm'>
              <p className='mb-2 font-medium'>Как работает система:</p>
              <ul className='space-y-1'>
                <li className='flex items-center'>
                  <span className='mr-2 inline-block h-2 w-2 rounded-full bg-green-500' />
                  <span>
                    Каждый день подряд: <strong>+5% к множителю</strong> (до
                    ×3.0)
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2 inline-block h-2 w-2 rounded-full bg-red-500' />
                  <span>
                    Пропуск дня: <strong>-15% к множителю</strong> (минимум
                    ×1.0)
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2 inline-block h-2 w-2 rounded-full bg-blue-500' />
                  <span>
                    XP за день: <strong>{habit.base_xp} × множитель</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Оригинальная версия с Progress компонентом
  return (
    <Card className='mb-4'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center justify-between text-lg'>
          <span>Статистика привычки</span>
          <span className='text-primary text-2xl font-bold'>
            {habit.total_xp} XP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Показатели в карточках */}
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            <div className='bg-primary/10 rounded-lg p-3 text-center'>
              <div className='text-primary text-2xl font-bold'>
                ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </div>
              <div className='text-muted-foreground text-sm'>Множитель</div>
            </div>

            <div className='rounded-lg bg-amber-50 p-3 text-center'>
              <div className='text-2xl font-bold text-amber-700'>
                {habit.current_streak}
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
                {habit.best_streak}
              </div>
              <div className='text-muted-foreground text-sm'>Лучший стрик</div>
            </div>

            <div className='rounded-lg bg-blue-50 p-3 text-center'>
              <div className='text-2xl font-bold text-blue-700'>
                {habit.base_xp}
              </div>
              <div className='text-muted-foreground text-sm'>База XP/день</div>
            </div>
          </div>

          {/* Прогресс опыта */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Накопленный опыт</span>
              <span>
                {habit.total_xp} / {maxPossibleXp} XP
              </span>
            </div>
            <Progress
              className='h-2'
              value={progressPercentage}
            />
          </div>

          {/* Правила системы */}
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
                  XP за день: <strong>{habit.base_xp} × множитель</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
