'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { LapTimerIcon } from '@radix-ui/react-icons';
import type { Task } from '@/generated/prisma';
import { TIME } from '../consts';
import { pauseTimerTask, startTimerTask } from '../app/actions/task';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';

type Props = {
  task: Task;
};

const POSITION = 2;

export const TaskTimer = ({ task }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [currentTask, setCurrentTask] = useState(task);
  const [time, setTime] = useState(0);

  const handlePrimaryButton = () => {
    startTransition(async () => {
      try {
        if (currentTask.status === 'CREATED') {
          await startTimerTask({ id: task.id });
        }
        toast.success('Задача сохранена');
      } catch (e: unknown) {
        toast.error('Ошибка сохранения задачи', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  const handleSecondaryButton = () => {
    startTransition(async () => {
      try {
        setCurrentTask(prev => ({
          ...prev,
          status: prev.status === 'PAUSED' ? 'CREATED' : 'PAUSED',
        }));
        await pauseTimerTask({ id: task.id, timeSpent: time });
      } catch (e: unknown) {
        toast.error('Ошибка сохранения задачи', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  useEffect(() => {
    if (currentTask.status !== 'IN_PROGRESS') return;

    const timerInterval = setInterval(() => {
      setTime(
        Math.floor(
          (new Date().getTime() - (task.startedAt ?? new Date()).getTime()) /
            TIME.SECOND,
        ),
      );
    }, TIME.SECOND);

    return () => {
      clearInterval(timerInterval);
    };
  });

  const [hours, minutes, seconds] = useMemo(
    () =>
      [
        String(
          Math.floor(time / (TIME.SECONDS_IN_MINUTE * TIME.MINUTE_IN_HOUR)),
        ).padStart(POSITION, '0'),
        String(
          Math.floor((time / TIME.SECONDS_IN_MINUTE) % TIME.MINUTE_IN_HOUR),
        ).padStart(POSITION, '0'),
        String(time % TIME.SECONDS_IN_MINUTE).padStart(POSITION, '0'),
      ] as const,
    [time],
  );

  return (
    <Card className='w-full max-w-3xl'>
      <CardHeader>
        <CardTitle>{currentTask.name}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center gap-8'>
        <LapTimerIcon className='size-16' />
        <span className='text-2xl tabular-nums'>
          {hours} : {minutes} : {seconds}
        </span>
      </CardContent>
      <CardFooter className='flex items-center justify-center gap-4'>
        <Button
          disabled={isPending}
          onClick={handlePrimaryButton}
        >
          {currentTask.status === 'CREATED' ? 'Начать' : 'Завершить'}
        </Button>
        <Button
          onClick={handleSecondaryButton}
          variant='secondary'
        >
          {currentTask.status === 'PAUSED' ? 'Продолжить' : 'Пауза'}
        </Button>
      </CardFooter>
    </Card>
  );
};
