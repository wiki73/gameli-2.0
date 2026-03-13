'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';
import { LapTimerIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import type { Task } from '@/generated/prisma';
import { type BarData, ROUTES, TIME } from '../consts';
import {
  completeTimerTask,
  pauseTimerTask,
  startTimerTask,
} from '../app/actions/task';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { ProgressBar } from './progress-bar';

type Props = {
  task: Task;
};

const POSITION = 2;
const MAX_HOURS = 24;
const MAX_TIME_SECONDS =
  MAX_HOURS * TIME.MINUTE_IN_HOUR * TIME.SECONDS_IN_MINUTE;

const validateTime = (timeValue: number): number => {
  if (timeValue < 0) return 0;
  if (timeValue > MAX_TIME_SECONDS) return MAX_TIME_SECONDS;
  return timeValue;
};

const calculateCurrentTime = (task: Task): number => {
  if (task.status === 'IN_PROGRESS' && task.startedAt) {
    const elapsed = Math.floor(
      (Date.now() - new Date(task.startedAt).getTime()) / TIME.SECOND,
    );
    return validateTime((task.timeSpent ?? 0) + elapsed);
  }
  return validateTime(task.timeSpent ?? 0);
};

export const TaskTimer = ({ task }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [currentTask, setCurrentTask] = useState(task);
  const { width, height } = useWindowSize();
  const [time, setTime] = useState(() => calculateCurrentTime(task));
  const [dataForBar, setDataForBar] = useState<BarData>({
    currentExp: undefined,
    addExperience: undefined,
    level: undefined,
    categoryName: undefined,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateTime = useCallback(() => {
    setTime(calculateCurrentTime(currentTask));
  }, [currentTask]);

  useEffect(() => {
    updateTime();
  }, [currentTask, updateTime]);

  useEffect(() => {
    stopTimer();
    if (currentTask.status === 'IN_PROGRESS') {
      timerRef.current = setInterval(updateTime, TIME.SECOND);
    }
    return stopTimer;
  }, [currentTask.status, updateTime, stopTimer]);

  const handlePrimaryButton = () => {
  startTransition(async () => {
    try {
      if (currentTask.status === 'CREATED') {
        await startTimerTask({ id: task.id });
        setCurrentTask(prev => ({
          ...prev,
          status: 'IN_PROGRESS',
          startedAt: new Date(),
          timeSpent: 0,
        }));
        toast.success('Задача начата');
      } else if (
        currentTask.status === 'IN_PROGRESS' ||
        currentTask.status === 'PAUSED'
      ) {
        stopTimer();
        
        const finalTime = time; 
        
        const { currentExp, addExperience, level, categoryName } =
          await completeTimerTask({
            task: task,
            timeSpent: finalTime,
          });
          
        setDataForBar({
          currentExp: currentExp,
          addExperience: addExperience,
          level: level,
          categoryName: categoryName,
        });
        
        setCurrentTask(prev => ({
          ...prev,
          status: 'COMPLETED',
          timeSpent: finalTime,
        }));
        
        setTime(finalTime);
        
        toast.success('Задача завершена');
      }
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
        const newStatus =
          currentTask.status === 'PAUSED' ? 'IN_PROGRESS' : 'PAUSED';

        await pauseTimerTask({
          id: task.id,
          timeSpent: time,
          status: newStatus,
        });

        setCurrentTask(prev => ({
          ...prev,
          status: newStatus,
          ...(newStatus === 'IN_PROGRESS' && { startedAt: new Date() }),
          timeSpent: time,
        }));

        toast.success(
          newStatus === 'IN_PROGRESS' ? 'Задача продолжена' : 'Задача на паузе',
        );
      } catch (e: unknown) {
        toast.error('Ошибка сохранения задачи', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  const [hours, minutes, seconds] = useMemo(() => {
    const validatedTime = validateTime(time);
    return [
      String(
        Math.floor(
          validatedTime / (TIME.SECONDS_IN_MINUTE * TIME.MINUTE_IN_HOUR),
        ),
      ).padStart(POSITION, '0'),
      String(
        Math.floor(
          (validatedTime / TIME.SECONDS_IN_MINUTE) % TIME.MINUTE_IN_HOUR,
        ),
      ).padStart(POSITION, '0'),
      String(validatedTime % TIME.SECONDS_IN_MINUTE).padStart(POSITION, '0'),
    ] as const;
  }, [time]);

  const getStatusColor = () => {
    switch (currentTask.status) {
      case 'IN_PROGRESS':
        return 'border-4 border-green-500';
      case 'PAUSED':
        return 'border-4 border-yellow-500';
      case 'COMPLETED':
        return 'border-4 border-blue-500';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch (currentTask.status) {
      case 'IN_PROGRESS':
        return 'В работе';
      case 'PAUSED':
        return 'На паузе';
      case 'COMPLETED':
        return 'Завершена';
      case 'CREATED':
        return 'Создана';
      default:
        return '';
    }
  };

  return (
    <>
      <Card className={`w-full max-w-3xl z-10 ${getStatusColor()}`}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-4xl'>{currentTask.name}</CardTitle>
            <div className='flex items-center gap-2'>
              <div
                className={`h-3 w-3 rounded-full ${
                  currentTask.status === 'IN_PROGRESS'
                    ? 'animate-pulse bg-green-500'
                    : currentTask.status === 'PAUSED'
                      ? 'bg-yellow-500'
                      : currentTask.status === 'COMPLETED'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                }`}
              />
              <span className='text-sm text-gray-600'>{getStatusText()}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col items-center justify-center gap-8'>
          <LapTimerIcon className='size-16' />
          <span className='mb-10 font-mono text-5xl tabular-nums'>
            {hours}:{minutes}:{seconds}
          </span>
          {currentTask.status === 'COMPLETED' && !!dataForBar.level && (
            <ProgressBar
              addedExperience={dataForBar.addExperience}
              categoryLevel={dataForBar.level}
              categoryName={dataForBar.categoryName}
              currentExperience={dataForBar.currentExp}
            />
          )}
        </CardContent>

        <CardFooter className='flex items-center justify-center gap-4'>
          {currentTask.status !== 'COMPLETED' ? (
            <Button
              disabled={isPending}
              onClick={handlePrimaryButton}
            >
              {currentTask.status === 'CREATED' ? 'Начать' : 'Завершить'}
            </Button>
          ) : (
            <Link
              className='rounded-xl bg-gray-200 p-3'
              href={`${ROUTES.MAIN}?tab=week`}
            >
              К планированию
            </Link>
          )}

          {currentTask.status !== 'CREATED' &&
            currentTask.status !== 'COMPLETED' && (
              <Button
                disabled={isPending}
                onClick={handleSecondaryButton}
                variant='secondary'
              >
                {currentTask.status === 'PAUSED' ? 'Продолжить' : 'Пауза'}
              </Button>
            )}
        </CardFooter>
      </Card>
      {currentTask.status === 'COMPLETED' && (
        <Confetti
          colors={[
            '#ff0a54',
            '#ff477e',
            '#ff7096',
            '#ff85a1',
            '#fbb1bd',
            '#f9bec7',
            '#00f5d4',
            '#9b5de5',
            '#f15bb5',
            '#fee440',
          ]}
          confettiSource={{
            x: 0,
            y: 0,
            w: width,
            h: 0,
          }}
          friction={0.99}
          gravity={0.15}
          height={height}
          initialVelocityX={{ min: -5, max: 5 }}
          initialVelocityY={{ min: 5, max: 10 }}
          numberOfPieces={800}
          recycle={true}
          run={true}
          width={width}
          wind={0.01}
        />
      )}
    </>
  );
};
