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

const TOTAL_HABITS = 21;
const HABITS_PER_ROW = 7;
const ERROR_TIMEOUT = 3000;
const PERCENT_DIVISOR = 100;

type Props = {
  habit: HabitWithEntries;
  onDelete?: () => void;
  userId: string;
};

export const HabitCard = ({ habit, onDelete, userId }: Props) => {
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
                return {
                  ...h,
                  entries: h.entries.map(entry =>
                    entry.day_number === dayNumber
                      ? {
                          ...entry,
                          completed,
                          completed_at: completed
                            ? new Date().toISOString()
                            : null,
                        }
                      : entry,
                  ),
                };
              }
              return h;
            }),
          };
        },
      );

      return { previousHabits };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', userId], context.previousHabits);
      }
      setError('Не удалось обновить привычку');
      setTimeout(() => {
        setError(null);
      }, ERROR_TIMEOUT);
    },
    // onSuccess: (data, variables) => {
    //   // Логирование для разработки
    //   if (process.env.NODE_ENV === 'development') {
    //     console.log(`День ${variables.dayNumber}: ${variables.completed ? 'выполнено' : 'отменено'}`);
    //   }
    // },
    onSettled: (data, error, variables) => {
      setLoadingDays(prev => ({ ...prev, [variables.dayNumber]: false }));
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
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

  const completedCount = habit.entries.filter(entry => entry.completed).length;
  const completionPercentage = Math.round(
    (completedCount / TOTAL_HABITS) * PERCENT_DIVISOR,
  );

  return (
    <Card className='rounded-md border m-4 mb-8'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <div className='font-bold text-2xl'>{habit.title}</div>
          {habit.description && (
            <CardDescription>{habit.description}</CardDescription>
          )}
        </div>
        {onDelete && (
          <Button
            onClick={onDelete}
            size='sm'
            variant='destructive'
          >
            Удалить
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md'>
            {error}
          </div>
        )}

        <Table>
          <TableBody>
            {habitRows.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex.toString()}`}>
                {row.map(dayNumber => {
                  const entry = habit.entries.find(
                    e => e.day_number === dayNumber,
                  );
                  const isLoading = loadingDays[dayNumber];

                  return (
                    <TableCell
                      className='text-center p-3 border-l'
                      key={`day-${dayNumber.toString()}`}
                    >
                      <div className='flex flex-col items-center gap-1'>
                        <div className='font-bold text-lg mb-1'>
                          {dayNumber.toString()}
                        </div>
                        <Checkbox
                          checked={entry?.completed || false}
                          className={`w-7 h-7 ${isLoading ? 'opacity-50' : ''}`}
                          disabled={isLoading || updateEntryMutation.isPending}
                          onCheckedChange={(checked: boolean) => {
                            handleCheckboxChange(dayNumber, checked);
                          }}
                        />
                        {entry?.completed_at && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            {new Date(entry.completed_at).toLocaleDateString(
                              'ru-RU',
                            )}
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

        <div className='p-4 text-sm text-muted-foreground border-t flex justify-between items-center'>
          <div>
            Сделано: {completedCount} из {TOTAL_HABITS}
            <span className='ml-2'>({completionPercentage}%)</span>
          </div>
          <div className='text-sm'>
            Создано: {new Date(habit.created_at).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
