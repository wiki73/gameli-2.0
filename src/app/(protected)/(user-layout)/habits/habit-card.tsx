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
import { deleteHabit, updateHabitEntry } from '@/src/app/actions/habits';
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
    <Card className='mb-4 rounded-md border shadow-sm transition-shadow hover:shadow-md sm:mb-8'>
      <CardHeader className='flex flex-col items-start gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3'>
        <div className='w-full sm:w-auto'>
          <div className='mb-1 text-xl font-bold sm:mb-2 sm:text-2xl'>
            {habit.title}
          </div>
          {habit.description && (
            <CardDescription className='mb-2 text-xs sm:mb-3 sm:text-sm'>
              {habit.description}
            </CardDescription>
          )}
        </div>

        <div className='flex w-full gap-1 sm:w-auto sm:gap-2'>
          <HabitCreateEditDialog
            habit={habit}
            modeForm='EDIT'
            userId={userId}
          >
            <Button
              className='h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm'
              size='sm'
              variant='outline'
            >
              ✏️
            </Button>
          </HabitCreateEditDialog>

          <Button
            className='h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm'
            disabled={isDeleting}
            onClick={handleDelete}
            size='sm'
            variant='destructive'
          >
            {isDeleting ? '...' : '🗑️'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='px-2 pt-0 sm:px-6'>
        {error && (
          <div className='mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 sm:mb-4 sm:p-3 sm:text-sm'>
            {error}
          </div>
        )}

        <div className='mb-4'>
          <HabitXpStats habit={habit} />
        </div>

        <div className='mb-3 overflow-hidden rounded-lg border sm:mb-4'>
          <Table>
            <TableBody>
              {habitRows.map((row) => (
                <TableRow key={`row-${String(row[0])}`}>
                  {row.map(dayNumber => {
                    const entry = habit.entries.find(
                      e => e.dayNumber === dayNumber,
                    );
                    const isLoading = loadingDays[dayNumber];

                    return (
                      <TableCell
                        className='border p-1 text-center sm:p-4'
                        key={dayNumber}
                      >
                        <div className='flex flex-col items-center gap-1 sm:gap-2'>
                          <div className='text-xs font-bold sm:text-lg'>
                            День {dayNumber}
                          </div>

                          <div className='relative'>
                            <Checkbox
                              checked={!!entry?.completedAt}
                              className={`h-6 w-6 border-2 sm:h-9 sm:w-9 ${
                                !!entry?.completedAt
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`}
                              disabled={isLoading}
                              onCheckedChange={(checked: boolean) => {
                                handleCheckboxChange(dayNumber, checked);
                              }}
                            />
                          </div>

                          {!!entry?.completedAt && (
                            <div className='text-[8px] text-gray-500 sm:text-xs'>
                              {new Date(entry.completedAt).toLocaleDateString(
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
