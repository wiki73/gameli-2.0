'use client';

import { useState } from 'react';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/src/components/ui/table';
import type { Habit, HabitEntry } from '@/generated/prisma';
import { deleteHabit, updateHabitEntry } from '../../actions/habits';
import { HabitCreateEditDialog } from './habits-create-edit-dialog';
import { HabitXpStats } from './habit-xp-stats';

const TOTAL_HABITS = 21;
const HABITS_PER_ROW = 7;
const ERROR_TIMEOUT = 3000;

type Props = {
  habit: Habit & { entries: HabitEntry[] }; // Теперь привычка включает записи и в схеме  тоже
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
  const [loadingDays, setLoadingDays] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Функция для обновления таблички
  const handleCheckboxChange = async (dayNumber: number, checked: boolean) => {
    try {
      setError(null);
      setLoadingDays(prev => ({ ...prev, [dayNumber]: true }));

      await updateHabitEntry({
        habitId: habit.id,
        dayNumber,
        completed: checked,
        userId,
      });

      // Показываем сообщение об успехе
      onSuccessMessage?.(
        `День ${String(dayNumber)} ${checked ? 'отмечен' : 'снят'}`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось обновить привычку. ${errorMessage}`);
      onError?.(`Ошибка: ${errorMessage}`);

      setTimeout(() => {
        setError(null);
      }, ERROR_TIMEOUT);
    } finally {
      setLoadingDays(prev => ({ ...prev, [dayNumber]: false }));
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
      return;
    }

    try {
      setIsDeleting(true);
      await deleteHabit({ id: habit.id });
      onSuccessMessage?.('Привычка удалена');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      onError?.(`Не удалось удалить привычку: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const habitsArray = Array.from({ length: TOTAL_HABITS }, (_, i) => i + 1);
  const habitRows = [];

  for (let i = 0; i < TOTAL_HABITS; i += HABITS_PER_ROW) {
    habitRows.push(habitsArray.slice(i, i + HABITS_PER_ROW));
  }

  // const completedCount = habit.entries.filter(entry => entry.completed).length;
  // const completionPercentage = Math.round(
  //   (completedCount / TOTAL_HABITS) * 100,
  // );
  // const todayXp = Math.round(habit.base_xp * habit.multiplier);

  return (
    <Card className='mb-8 rounded-md border shadow-sm transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <div className='flex-1'>
          <div className='mb-2 text-2xl font-bold'>{habit.title}</div>
          {habit.description && (
            <CardDescription className='mb-3'>
              {habit.description}
            </CardDescription>
          )}

          {/* ... остальной код UI без изменений ... */}
        </div>

        <div className='ml-4 flex gap-2'>
          <HabitCreateEditDialog
            habit={habit}
            modeForm='EDIT'
            userId={userId}
          >
            <Button
              size='sm'
              variant='outline'
            >
              ✏️ Изменить
            </Button>
          </HabitCreateEditDialog>

          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            size='sm'
            variant='destructive'
          >
            {isDeleting ? 'Удаление...' : '🗑️ Удалить'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {error && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
            <div className='font-medium'>Ошибка:</div>
            {error}
          </div>
        )}

        <div className='mb-6'>
          <HabitXpStats habit={habit} />
        </div>

        <div className='mb-4 overflow-hidden rounded-lg border'>
          <Table>
            <TableBody>
              {habitRows.map(row => (
                <TableRow key={`row-${String(row[0])}`}>
                  {row.map(dayNumber => {
                    const entry = habit.entries.find(
                      e => e.day_number === dayNumber,
                    );
                    const isLoading = loadingDays[dayNumber];
                    const xpEarned = entry?.xp_earned || 0;

                    return (
                      <TableCell
                        className='border p-4 text-center'
                        key={dayNumber}
                      >
                        <div className='flex flex-col items-center gap-2'>
                          <div className='text-lg font-bold'>
                            День {dayNumber}
                          </div>

                          <div className='relative'>
                            <Checkbox
                              checked={entry?.completed || false}
                              className={`h-9 w-9 border-2 ${
                                entry?.completed
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`}
                              disabled={isLoading}
                              onCheckedChange={(checked: boolean) => {
                                handleCheckboxChange(dayNumber, checked);
                              }}
                            />

                            {entry?.completed && xpEarned > 0 && (
                              <div className='absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-xs text-white'>
                                {xpEarned}
                              </div>
                            )}
                          </div>

                          {entry?.completed_at && (
                            <div className='text-xs text-gray-500'>
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
        </div>
      </CardContent>
    </Card>
  );
};
