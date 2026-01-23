import { Link, useNavigate, useParams } from 'react-router';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { useQueryClient } from '@tanstack/react-query';
import { Timer } from '@/components/widgets/timer/Timer';
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
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { ProgressBar } from './ProgressBar/ProgressBar';

export type TaskState = 'TIMER' | 'PAUSE' | 'COMPLETE';

export const TaskPage = () => {
  const { taskId } = useParams();
  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [taskState, setTaskState] = useState<TaskState>('TIMER');
  const [showEffect, setShowEffect] = useState(false);
  const [time, setTime] = useState(() => {
    const saved = localStorage.getItem(`timer_time_${String(taskId)}`);
    return saved ? Number(saved) : 0;
  });

  const { data: task, isFetching } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.tasks.getOne({ id: taskId ?? '' }),
    enabled: !!taskId,
  });

  const { data: category, isFetching: isCategoryFetching } = useQuery({
    queryKey: ['category', task],
    queryFn: () => api.categories.getOne({ id: task?.category_id ?? '' }),
    enabled: !!taskId,
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
          payload: { userId: user?.id, dayId: task?.day_id },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.USER,
          payload: { userId: user?.id },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.CATEGORIES,
          payload: { userId: user?.id },
        }),
      });
    },
  });

  useEffect(() => {
    if (task?.is_done) {
      navigate(ROUTES.MAIN);
    }
  }, [navigate, task?.is_done]);

  const experience = useMemo(
    () => getExperience(time, category?.ratio),
    [time, category?.ratio],
  );

  const handelSubmit = () => {
    if (!task || !user) return;
    setTaskState('COMPLETE');
    setShowEffect(true);
    completeTaskMutation.mutate({
      taskId: task.id,
      categoryId: task.category_id,
      categoryCurrentExperience: category?.experience || 0,
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

  if (isFetching || isCategoryFetching) {
    return <FullScreenSpinner />;
  }

  if (!task || !category || !taskId) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div className='fixed inset-0 flex justify-center items-center'>
      <Card className='z-10 max-w-md w-full'>
        <CardHeader className='text-center'>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>{category.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Timer
            setTime={setTime}
            state={taskState}
            taskId={taskId}
            time={time}
          />
          {taskState === 'COMPLETE' && (
            <div>
              <h4>Заработанно {experience} опыта</h4>
              <ProgressBar
                addedExperience={experience}
                categoryLevel={category.level}
                currentExperience={category.experience}
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
      {showEffect && (
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
