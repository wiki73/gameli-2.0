import { Link, useNavigate, useParams } from 'react-router';
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

export const TaskPage = () => {
  const { taskId = '' } = useParams();
  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [localTask, setLocalTask] = useState<Nullable<TaskWithCategory>>(() => {
    const saved = localStorage.getItem('activeTask');
    return saved ? (JSON.parse(saved) as TaskWithCategory) : null;
  });

  const { time = 0 } = localTask || {};

  const [taskState, setTaskState] = useState<TaskState>('TIMER');

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
        setLocalTask({
          ...task,
          time,
        });
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
          payload: { userId: user?.id ?? '', dayId },
        }),
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
          payload: { userId: user?.id ?? '' },
        }),
      });
    },
  });

  useEffect(() => {
    if (isTaskDone) {
      navigate(ROUTES.MAIN);
    }
  }, [navigate, isTaskDone]);

  useEffect(() => {
    localStorage.setItem('activeTask', JSON.stringify(localTask));
  }, [localTask]);

  const experience = useMemo(
    () => getExperience(time, categoryRatio),
    [time, categoryRatio],
  );

  const handelSubmit = () => {
    if (!taskId || !user) return;
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
            setLocalTask={setLocalTask}
            state={taskState}
            time={time}
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
