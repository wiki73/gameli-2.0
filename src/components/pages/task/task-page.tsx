import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { useQueryClient } from '@tanstack/react-query';
import { Timer } from '@/components/widgets/CategoryBlock/timer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FullScreenSpinner } from '@/components/ui/spinner';
import { completeTask } from '@/lib/tasks';
import { getExperience, getQueryKey, QUERY_KEY_TYPES, ROUTES } from '@/consts';
import type { TaskWithCategory } from '@/api/tasks/types';
import type { Nullable } from '@/api/types';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth';
import { ProgressBar } from './progress-bar';

export type TaskState = 'TIMER' | 'PAUSE' | 'COMPLETE';

type TimerState = {
  startTime: number | null;
  pausedAt: number | null;
  totalPaused: number;
  isRunning: boolean;
};

const TICK_INTERVAL = 1000;

export const TaskPage = () => {
  const { taskId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const tasksPage = Number(searchParams.get('tasksPage') ?? 1);
  const categoriesPage = Number(searchParams.get('categoriesPage') ?? 1);
  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [localTask, setLocalTask] = useState<Nullable<TaskWithCategory>>(() => {
    const saved = localStorage.getItem('activeTask');
    return saved ? (JSON.parse(saved) as TaskWithCategory) : null;
  });
  const [taskState, setTaskState] = useState<TaskState>('TIMER');

  const TIMER_KEY = taskId ? `timerState_${taskId}` : null;

  const [timer, setTimer] = useState<TimerState>(() => {
    if (!TIMER_KEY) {
      return {
        startTime: null,
        pausedAt: null,
        totalPaused: 0,
        isRunning: false,
      };
    }

    const saved = localStorage.getItem(TIMER_KEY);
    return saved
      ? (JSON.parse(saved) as TimerState)
      : {
          startTime: null,
          pausedAt: null,
          totalPaused: 0,
          isRunning: false,
        };
  });

  const startTimer = () => {
    const now = Date.now();

    setTimer({
      startTime: now,
      pausedAt: null,
      totalPaused: 0,
      isRunning: true,
    });
  };
  const pauseTimer = () => {
    setTimer(prev => ({
      ...prev,
      pausedAt: Date.now(),
      isRunning: false,
    }));
  };
  const resumeTimer = () => {
    const now = Date.now();

    setTimer(prev => ({
      ...prev,
      totalPaused: prev.totalPaused + (now - (prev.pausedAt ?? now)),
      pausedAt: null,
      isRunning: true,
    }));
  };
  const getElapsedTime = (timer: TimerState) => {
    if (!timer.startTime) return 0;

    const now = timer.isRunning ? Date.now() : (timer.pausedAt ?? Date.now());
    return now - timer.startTime - timer.totalPaused;
  };

  useEffect(() => {
    if (!TIMER_KEY) return;
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
  }, [timer, TIMER_KEY]);

  useEffect(() => {
    if (taskState === 'TIMER' && !timer.isRunning) {
      if (!timer.startTime) {
        startTimer();
      } else {
        resumeTimer();
      }
    }

    if (taskState === 'PAUSE' && timer.isRunning) {
      pauseTimer();
    }
  }, [taskState, timer]);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!timer.startTime && taskState === 'TIMER') {
      startTimer();
    }
  }, [taskState, timer]);

  const elapsedTime = useMemo(() => {
    void tick; // Это официальный способ в TS сказать: "я использую эту переменную, просто ничего с ней не делаю"
    return getElapsedTime(timer);
  }, [timer, tick]);

  useEffect(() => {
    if (taskState === 'COMPLETE') return;

    const id = setInterval(() => {
      setTick(t => t + 1);
    }, TICK_INTERVAL);

    return () => {
      clearInterval(id);
    };
  }, [taskState]);

  const {
    data: {
      title: taskTitle = '',
      is_done: isTaskDone = false,
      day_id: dayId = '',
      category: {
        id: categoryId = '',
        name: categoryName = '',
        level: categoryLevel = 1,
        experience: categoryExperience = 0,
        ratio: categoryRatio = 1,
      } = {},
    } = {},
    isFetching,
  } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.TASK,
      payload: { taskId: taskId },
    }),
    queryFn: async () => {
      const task = await api.tasks.getOne({ id: taskId });

      if (task) {
        setLocalTask(task);
      }

      return task;
    },
    enabled: !!taskId,
    staleTime: 0,
    refetchOnMount: 'always',
    initialData: localTask ? localTask : undefined,
  });

  const completeTaskMutation = useMutation<
    { offline: boolean },
    unknown,
    Parameters<typeof completeTask>[0]
  >({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.TASKS,
          payload: { userId: user?.id ?? '', dayId, page: tasksPage },
        }),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.USER,
          payload: {},
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.CATEGORIES,
          payload: { userId: user?.id ?? '', page: categoriesPage },
        }),
        exact: false,
      });
    },
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (taskState === 'COMPLETE') {
        localStorage.removeItem('activeTask');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (taskState === 'COMPLETE') {
        localStorage.removeItem('activeTask');
      }
    };
  }, [taskState]);

  useEffect(() => {
    if (isTaskDone) {
      navigate(ROUTES.MAIN);
    }
  }, [navigate, isTaskDone]);

  useEffect(() => {
    localStorage.setItem('activeTask', JSON.stringify(localTask));
  }, [localTask]);

  const experience = useMemo(() => {
    const elapsedSeconds = Math.floor(elapsedTime / TICK_INTERVAL);
    return getExperience(elapsedSeconds, categoryRatio);
  }, [elapsedTime, categoryRatio]);

  const handelSubmit = () => {
    if (!taskId || !user) return;
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      pausedAt: Date.now(),
    }));
    setTaskState('COMPLETE');
    completeTaskMutation.mutate({
      taskId,
      categoryId,
      categoryCurrentExperience: categoryExperience,
      userId: user.id,
      userCurrentExperience: user.exp || 0,
      earnedExperience: experience,
    });
  };

  const handelPause = () => {
    if (taskState === 'TIMER') {
      setTaskState('PAUSE');
    } else {
      setTaskState('TIMER');
    }
  };

  if (isFetching) {
    return <FullScreenSpinner />;
  }

  if (!taskId || !categoryId || !taskId) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div className='fixed inset-0 flex justify-center items-center'>
      <Card className='z-10 max-w-md w-full'>
        <CardHeader className='text-center'>
          <CardTitle>{taskTitle}</CardTitle>
          <CardDescription>{categoryName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Timer
            state={taskState}
            time={elapsedTime}
          />

          {taskState === 'COMPLETE' && (
            <div>
              <h4>Заработанно {experience} опыта</h4>
              <ProgressBar
                addedExperience={experience}
                categoryLevel={categoryLevel}
                currentExperience={categoryExperience}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className='gap-4 items-center justify-center flex'>
          {taskState === 'TIMER' || taskState === 'PAUSE' ? (
            <Button onClick={handelSubmit}>
              <CheckIcon />
              Завершить
            </Button>
          ) : (
            <Link to={ROUTES.MAIN}>
              <Button>
                <CheckIcon />К планированю
              </Button>
            </Link>
          )}
          {taskState !== 'COMPLETE' && (
            <Button
              onClick={handelPause}
              variant='secondary'
            >
              {taskState === 'PAUSE' ? 'Снять паузы' : 'Пауза'}
            </Button>
          )}
        </CardFooter>
      </Card>
      {taskState === 'COMPLETE' && (
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
          gravity={0.05}
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
    </div>
  );
};
