import { useEffect, useState } from 'react';
import { CheckCircledIcon, TimerIcon } from '@radix-ui/react-icons';
import classes from './timer.module.css';

export const Timer = ({ mode }) => {
  const [time, setTime] = useState(() => {
    const saved = localStorage.getItem('timer_time');
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    if (mode !== 'TIMER') return;
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);
  useEffect(() => {
    localStorage.setItem('timer_time', time);
  }, [time]);

  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');

  return (
    <div className={classes.timer}>
      {mode === 'TIMER' && (
        <TimerIcon
          height={70}
          width={70}
        />
      )}

      {mode === 'PAUSE' && (
        <>
          <TimerIcon
            height={70}
            width={70}
          />
          <p>Пауза</p>
        </>
      )}

      {mode === 'COMPLETE' && (
        <>
          <CheckCircledIcon
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
    </div>
  );
};
