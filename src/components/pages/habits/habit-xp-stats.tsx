import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HabitWithEntries } from '@/api/habits/types';

type Props = {
  habit: HabitWithEntries;
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

  return (
    <Card className='mb-4'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex justify-between items-center'>
          <span>Статистика привычки</span>
          <span className='text-2xl font-bold text-primary'>
            {habit.total_xp} XP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Показатели в карточках */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div className='text-center p-3 bg-primary/10 rounded-lg'>
              <div className='text-2xl font-bold text-primary'>
                ×{habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </div>
              <div className='text-sm text-muted-foreground'>Множитель</div>
            </div>

            <div className='text-center p-3 bg-amber-50 rounded-lg'>
              <div className='text-2xl font-bold text-amber-700'>
                {habit.current_streak}
              </div>
              <div className='text-sm text-muted-foreground'>Дней подряд</div>
              <div className='text-xs text-amber-600 mt-1'>
                {daysUntilMultiplierIncrease} до ×
                {(habit.multiplier * DAILY_MULTIPLIER_INCREASE).toFixed(
                  MULTIPLIER_DECIMAL_PLACES,
                )}
              </div>
            </div>

            <div className='text-center p-3 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-700'>
                {habit.best_streak}
              </div>
              <div className='text-sm text-muted-foreground'>Лучший стрик</div>
            </div>

            <div className='text-center p-3 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-700'>
                {habit.base_xp}
              </div>
              <div className='text-sm text-muted-foreground'>База XP/день</div>
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
          <div className='text-sm text-muted-foreground border-t pt-3'>
            <p className='font-medium mb-2'>Как работает система:</p>
            <ul className='space-y-1'>
              <li className='flex items-center'>
                <span className='inline-block w-2 h-2 bg-green-500 rounded-full mr-2' />
                <span>
                  Каждый день подряд: <strong>+5% к множителю</strong> (до ×3.0)
                </span>
              </li>
              <li className='flex items-center'>
                <span className='inline-block w-2 h-2 bg-red-500 rounded-full mr-2' />
                <span>
                  Пропуск дня: <strong>-15% к множителю</strong> (минимум ×1.0)
                </span>
              </li>
              <li className='flex items-center'>
                <span className='inline-block w-2 h-2 bg-blue-500 rounded-full mr-2' />
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
