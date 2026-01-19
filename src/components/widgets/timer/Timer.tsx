import { CheckIcon, LapTimerIcon, PauseIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { TaskState } from '@/components/pages/task/TaskPage';
import classes from './Timer.module.pcss';

type Props = {
  state: TaskState;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  taskId: string;
};

export const Timer = ({ state: mode, time, setTime, taskId }: Props) => {
  useEffect(() => {
    if (mode !== 'TIMER') return;
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, setTime]);
  useEffect(() => {
    localStorage.setItem(`timer_time_${taskId}`, time.toString());
  }, [time, taskId]);

  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');

  return (
    <div className={classes.timer}>
      {mode === 'TIMER' && (
        <LapTimerIcon
          height={70}
          width={70}
        />
      )}

      {mode === 'PAUSE' && (
        <PauseIcon
          height={70}
          width={70}
        />
      )}

      {mode === 'COMPLETE' && (
        <>
          <CheckIcon
            height={70}
            width={70}
          />
          <p>Вы занимались</p>
        </>
      )}

      <h2 className={classes.time}>
        {hours} : {minutes} : {seconds}
      </h2>

      <p className={classes.message}>
        {mode === 'COMPLETE' ? 'Отличная работа!' : 'У вас всё получится!'}
      </p>
      {mode === 'COMPLETE' && <h3>😁Улыбнитесь себе!😁</h3>}
    </div>
  );
};
