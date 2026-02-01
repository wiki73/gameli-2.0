import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitApi } from '@/api/habits';
import type { HabitWithEntries } from '@/api/habits/types';
import { HabitCreateEditDialog } from './habits-create-edit-dialog';
import { HabitXpStats } from './habit-xp-stats';

const TOTAL_HABITS = 21;
const HABITS_PER_ROW = 7;
const ERROR_TIMEOUT = 3000;
const PERCENT_DIVISOR = 100;
const MULTIPLIER_DECIMAL_PLACES = 2;

type Props = {
  habit: HabitWithEntries;
  onDelete?: () => void;
  onSuccessMessage?: (message: string) => void;
  onError?: (errorMessage: string) => void;
  userId: string;
};

export const HabitCard = ({
  habit,
  onDelete,
  onSuccessMessage,
  onError,
  userId,
}: Props) => {
  const queryClient = useQueryClient();
  const [loadingDays, setLoadingDays] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const updateEntryMutation = useMutation({
    mutationFn: async ({
      dayNumber,
      completed,
    }: {
      dayNumber: number;
      completed: boolean;
    }) =>
      habitApi.updateEntry({
        habitId: habit.id,
        dayNumber,
        completed,
        userId,
      }),
    onMutate: async ({ dayNumber, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['habits', userId] });

      const previousHabits = queryClient.getQueryData<{
        data: HabitWithEntries[];
      }>(['habits', userId]);

      queryClient.setQueryData<{ data: HabitWithEntries[] }>(
        ['habits', userId],
        old => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map(h => {
              if (h.id === habit.id) {
                // Обновляем запись дня
                const updatedEntries = h.entries.map(entry =>
                  entry.day_number === dayNumber
                    ? {
                        ...entry,
                        completed,
                        completed_at: completed
                          ? new Date().toISOString()
                          : null,
                      }
                    : entry,
                );

                return {
                  ...h,
                  entries: updatedEntries,
                };
              }
              return h;
            }),
          };
        },
      );

      return { previousHabits };
    },
    onError: (err, _variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', userId], context.previousHabits);
      }
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось обновить привычку. ${errorMessage}`);
      setTimeout(() => {
        setError(null);
      }, ERROR_TIMEOUT);
    },
    onSettled: (_data, _error, variables) => {
      setLoadingDays(prev => ({ ...prev, [variables.dayNumber]: false }));
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => habitApi.delete({ id: habit.id, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      onSuccessMessage?.('Привычка удалена');
    },
    onError: err => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      onError?.(`Не удалось удалить привычку: ${errorMessage}`);
    },
  });

  const habitsArray = Array.from({ length: TOTAL_HABITS }, (_, i) => i + 1);

  const habitRows = [];
  for (let i = 0; i < TOTAL_HABITS; i += HABITS_PER_ROW) {
    habitRows.push(habitsArray.slice(i, i + HABITS_PER_ROW));
  }

  const handleCheckboxChange = (dayNumber: number, checked: boolean) => {
    try {
      setError(null);
      setLoadingDays(prev => ({ ...prev, [dayNumber]: true }));

      updateEntryMutation.mutate({
        dayNumber,
        completed: checked,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось обновить привычку. ${errorMessage}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteMutation.mutate();
    }
  };

  const completedCount = habit.entries.filter(entry => entry.completed).length;
  const completionPercentage = Math.round(
    (completedCount / TOTAL_HABITS) * PERCENT_DIVISOR,
  );

  // Рассчитываем XP, который можно получить сегодня
  const todayXp = Math.round(habit.base_xp * habit.multiplier);

  return (
    <Card className='rounded-md border mb-8 shadow-sm hover:shadow-md transition-shadow'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <div className='flex-1'>
          <div className='font-bold text-2xl mb-2'>{habit.title}</div>
          {habit.description && (
            <CardDescription className='mb-3'>
              {habit.description}
            </CardDescription>
          )}

          {/* Статус-баджи */}
          <div className='flex flex-wrap items-center gap-2'>
            <span className='px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1'>
              <span className='text-lg'>×</span>
              <span className='font-bold'>
                {habit.multiplier.toFixed(MULTIPLIER_DECIMAL_PLACES)}
              </span>
              <span className='text-xs ml-1'>множитель</span>
            </span>

            <span className='px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-1'>
              <span className='text-lg'>🔥</span>
              <span className='font-bold'>{habit.current_streak}</span>
              <span className='text-xs ml-1'>дней подряд</span>
            </span>

            <span className='px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1'>
              <span className='text-lg'>⭐</span>
              <span className='font-bold'>{habit.total_xp}</span>
              <span className='text-xs ml-1'>всего XP</span>
            </span>

            <span className='px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1'>
              <span className='text-lg'>🎯</span>
              <span className='font-bold'>{todayXp}</span>
              <span className='text-xs ml-1'>XP сегодня</span>
            </span>
          </div>
        </div>

        <div className='flex gap-2 ml-4'>
          <HabitCreateEditDialog
            habit={habit}
            modeForm='EDIT'
          >
            <Button
              className='flex items-center gap-1'
              size='sm'
              variant='outline'
            >
              <span className='text-lg'>✏️</span>
              Изменить
            </Button>
          </HabitCreateEditDialog>

          <Button
            className='flex items-center gap-1'
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            size='sm'
            variant='destructive'
          >
            <span className='text-lg'>🗑️</span>
            {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {error && (
          <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200'>
            <div className='font-medium'>Ошибка:</div>
            {error}
          </div>
        )}

        {/* Статистика привычки */}
        <div className='mb-6'>
          <HabitXpStats habit={habit} />
        </div>

        {/* Таблица дней */}
        <div className='border rounded-lg overflow-hidden mb-4'>
          <Table>
            <TableBody>
              {habitRows.map((row, rowIndex) => (
                <TableRow
                  className='hover:bg-muted/50 transition-colors'
                  key={`row-${rowIndex.toString()}`}
                >
                  {row.map(dayNumber => {
                    const entry = habit.entries.find(
                      e => e.day_number === dayNumber,
                    );
                    const isLoading = loadingDays[dayNumber];
                    const xpEarned = entry?.xp_earned || 0;

                    return (
                      <TableCell
                        className='text-center p-4 border hover:bg-muted/30 transition-colors'
                        key={`day-${dayNumber.toString()}`}
                      >
                        <div className='flex flex-col items-center gap-2'>
                          <div className='font-bold text-lg text-foreground/80'>
                            День {dayNumber.toString()}
                          </div>

                          <div className='relative'>
                            <Checkbox
                              checked={entry?.completed || false}
                              className={`w-9 h-9 border-2 ${isLoading ? 'opacity-50' : ''} ${
                                entry?.completed
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground/30'
                              }`}
                              disabled={
                                isLoading || updateEntryMutation.isPending
                              }
                              onCheckedChange={(checked: boolean) => {
                                handleCheckboxChange(dayNumber, checked);
                              }}
                            />

                            {/* Индикатор XP */}
                            {entry?.completed && xpEarned > 0 && (
                              <div className='absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                                {xpEarned}
                              </div>
                            )}
                          </div>

                          {entry?.completed_at && (
                            <div className='text-xs text-muted-foreground mt-1'>
                              {new Date(entry.completed_at).toLocaleDateString(
                                'ru-RU',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                },
                              )}
                            </div>
                          )}

                          {/* Подсказка XP */}
                          {!entry?.completed && (
                            <div className='text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity'>
                              +{todayXp} XP
                            </div>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Итоговая статистика */}
        <div className='p-4 text-sm text-muted-foreground border-t flex flex-col sm:flex-row justify-between items-center gap-4'>
          <div className='space-y-1'>
            <div className='font-medium'>
              Прогресс: {completedCount} из {TOTAL_HABITS} дней
              <span className='ml-2 font-bold'>({completionPercentage}%)</span>
            </div>
            <div className='text-xs'>
              Средний XP за день:{' '}
              {habit.total_xp > 0
                ? Math.round(habit.total_xp / completedCount)
                : 0}
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='text-right'>
              <div className='text-sm font-medium'>Создано</div>
              <div className='text-xs'>
                {new Date(habit.created_at).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div className='text-right'>
              <div className='text-sm font-medium'>Лучший стрик</div>
              <div className='text-xs font-bold text-amber-700'>
                {habit.best_streak} дней
              </div>
            </div>

            <div className='text-right'>
              <div className='text-sm font-medium'>Общий вклад</div>
              <div className='text-xs font-bold text-blue-700'>
                {habit.total_xp} XP
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
