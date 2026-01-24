'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Habit } from '@/api/habits/types';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const weeks = ['Неделя 1', 'Неделя 2', 'Неделя 3'];

type Props = {
  habit: Habit;
};

export const HabitCard = ({ habit }: Props) => {
  const [schedule, setSchedule] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (
    week: string,
    day: string,
    checked: boolean,
  ) => {
    const id = `${week}-${day}`;

    setSchedule(prev => ({
      ...prev,
      [id]: checked,
    }));

    // console.log(`Изменение: ${id} теперь ${checked}`);
  };

  return (
    <Card className='rounded-md border m-4 mb-8'>
      <CardHeader>
        <CardHeader className='font-bold text-2xl'>{habit.title}</CardHeader>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-30 font-bold text-xl'>Период</TableHead>
              {daysOfWeek.map(day => (
                <TableHead
                  className='text-center font-bold text-xl'
                  key={day}
                >
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeks.map(week => (
              <TableRow key={week}>
                <TableCell className='font-bold text-xl'>{week}</TableCell>
                {daysOfWeek.map(day => {
                  const id = `${week}-${day}`;
                  return (
                    <TableCell
                      className='text-center border-l'
                      key={day}
                    >
                      <Checkbox
                        checked={schedule[id] || false}
                        className='w-7 h-7'
                        id={id}
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(week, day, checked);
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='p-4 text-sm text-muted-foreground border-t'>
          Сделанно: {Object.values(schedule).filter(Boolean).length}
        </div>
      </CardContent>
    </Card>
  );
};
