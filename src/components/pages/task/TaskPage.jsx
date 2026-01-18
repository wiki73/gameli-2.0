import { useParams } from 'react-router';
import { CheckIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Timer } from '@/components/widgets/timer/Timer';
import { api } from '../../../api/api';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import classes from './TaskPage.module.css';
import { TaskCompleteEffect } from './TaskComplete.module/TaskCompleteEffect';
import { ProgressBar } from './ProgressBar/ProgressBar';
// import { timeEnd } from 'console';

export const TaskPage = () => {
  const { taskId } = useParams();
  const [modeForTimer, setModeForTimer] = useState('TIMER');

  const [exp, setExp] = useState(0);

  const [showEffect, setShowEffect] = useState(false);

  const [time, setTime] = useState(() => {
    const saved = localStorage.getItem('timer_time');
    return saved ? Number(saved) : 0;
  });

  const { data: task, isFetching } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.tasks.getOne({ id: taskId }),
    enabled: !!taskId,
  });

  const { data: category, isFetching: isCategoryFetching } = useQuery({
    queryKey: ['category', task],
    queryFn: () => api.categories.getOne({ id: task.category_id }),
    enabled: !!taskId,
  });

  if (isFetching || isCategoryFetching) {
    return <FullScreenSpinner />;
  }

  const getTimeIntervarRatio = () => {
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
  };
  const getExp = () => {
    const categoryRatio = category.ratio;
    const timeIntervarRatio = getTimeIntervarRatio();
    const res = Math.round((time * categoryRatio * timeIntervarRatio) / 100);

    return res;
  };

  const handelSubmit = () => {
    setModeForTimer('COMPLETE');
    setExp(getExp());
    setShowEffect(true);
    startConfetti(); //const intervalId = startConfetti() clearInterval(intervalId); если надо выключить конффети
  };
  const handelPause = () => {
    if (modeForTimer === 'TIMER') {
      setModeForTimer('PAUSE');
    } else {
      setModeForTimer('TIMER');
    }
  };

  const startConfetti = () => {
    const interval = setInterval(() => {
      const centerX = 0.5;
      const offset = 350 / window.innerWidth;

      confetti({
        particleCount: 30,
        spread: 100,
        startVelocity: 20,
        origin: { x: centerX - offset, y: Math.random() * 0.6 },
        scalar: 0.6,
      });

      confetti({
        particleCount: 30,
        spread: 100,
        startVelocity: 20,
        origin: { x: centerX + offset, y: Math.random() * 0.6 },
        scalar: 0.6,
      });
    }, 400);

    return interval;
  };

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
          time={time}
        />
        {modeForTimer === 'COMPLETE' && (
          <div className={classes.containerForComplete}>
            <h4>Заработанно</h4>
            <div className={classes.textForComplete}>
              <p>Опыт</p>
              <p>{exp}</p>
            </div>
            <div className={classes.textForComplete}>
              <div>Кристалы</div>
              <div>{23}</div>
            </div>
            <ProgressBar
              addedExp={exp}
              currentExp={500}
              maxExp={1000}
            />
          </div>
        )}
      </Card>
      <div className={classes.buttons}>
        <Button onClick={handelSubmit}>
          <CheckIcon />
          Завершить
        </Button>
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
        <TaskCompleteEffect
          onClose={() => setShowEffect(false)}
          open={showEffect}
          timeForClose={5000}
        />
      )}
    </div>
  );
};
