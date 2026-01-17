import { useEffect, useState } from 'react';
import { TimerIcon } from '@radix-ui/react-icons';
import classes from './timer.css';

export const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');

  return (
    <div className={classes.timer}>
      <TimerIcon
        height={70}
        width={70}
      />
      <h2 className={classes.time}>
        {hours} : {minutes} : {seconds}
      </h2>
      <p className={classes.message}>У вас всё получиться!</p>
    </div>
  );
};
