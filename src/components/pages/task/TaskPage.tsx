import { Link, useParams } from 'react-router';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Timer } from '@/components/widgets/timer/Timer';
import { api } from '../../../api/api';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import { completeTask } from '../../../utils/tasks';
import { useAuth } from '../../../contexts/auth-context';
import { ROUTES } from '../../../constants/routes';
import { ProgressBar } from './ProgressBar/ProgressBar';
import classes from './TaskPage.module.css';

export const TaskPage = () => {
  const { taskId } = useParams();
  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [modeForTimer, setModeForTimer] = useState('TIMER');
  const [experience, setExperience] = useState(0);
  const [showEffect, setShowEffect] = useState(false);
  const [time, setTime] = useState(() => {
    const saved = localStorage.getItem(`timer_time_${taskId}`);
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

  const completeTaskMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });

  const getTimeIntervarRatio = useCallback(() => {
    const min = Math.trunc(time / 60);
    if (min <= 15) {
      return 0.75;
    } else if (min <= 30) {
      return 1;
    } else if (min <= 60) {
      return 1.25;
    } else if (min <= 90) {
      return 1.5;
    } else {
      return 2;
    }
  }, [time]);

  const getExp = useCallback(() => {
    const categoryRatio = category?.ratio;
    const timeIntervarRatio = getTimeIntervarRatio();
    if (!categoryRatio) return 0;
    const res = Math.round((time * categoryRatio * timeIntervarRatio) / 100);

    return res;
  }, [category?.ratio, getTimeIntervarRatio, time]);

  const handelSubmit = () => {
    if (!task || !user) return;
    setModeForTimer('COMPLETE');
    setExperience(getExp());
    setShowEffect(true);
    completeTaskMutation.mutate({
      taskId: task.id,
      categoryId: task.category_id,
      userId: user.id,
      experience: getExp(),
    });
  };

  const handelPause = () => {
    if (modeForTimer === 'TIMER') {
      setModeForTimer('PAUSE');
    } else {
      setModeForTimer('TIMER');
    }
  };

  if (isFetching || isCategoryFetching) {
    return <FullScreenSpinner />;
  }

  if (!task || !category) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div className={classes.taskPage}>
      <div className={classes.header}>
        <h2 className={classes.title}>{task.title}</h2>
        <h3 className={classes.category}>{category.name}</h3>
      </div>
      <Card className={classes.containerTime}>
        <Timer
          mode={modeForTimer}
          setTime={setTime}
          taskId={taskId}
          time={time}
        />
        {modeForTimer === 'COMPLETE' && (
          <div className={classes.containerForComplete}>
            <h4>Заработанно</h4>
            <div className={classes.textForComplete}>
              <p>Опыт</p>
              <p>{experience}</p>
            </div>
            <div className={classes.textForComplete}>
              <div>Кристалы</div>
              <div>...</div>
            </div>
            <div>
              <h3 style={{ textAlign: 'center' }}>{category.name}</h3>
              <ProgressBar
                addedExp={experience}
                currentExp={500}
                maxExp={1000}
              />
            </div>
          </div>
        )}
      </Card>
      <div className={classes.buttons}>
        {modeForTimer === 'TIMER' || modeForTimer === 'PAUSE' ? (
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
        <Button
          onClick={handelPause}
          variant='secondary'
        >
          {modeForTimer === 'TIMER' || modeForTimer === 'COMPLETE' ? (
            <p>Пауза</p>
          ) : (
            <p>Снять паузы</p>
          )}
        </Button>
      </div>
      {showEffect && (
        <Confetti
          height={height}
          width={width}
        />
      )}
    </div>
  );
};
