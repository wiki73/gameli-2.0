import { CheckIcon, LapTimerIcon, PauseIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import type { TaskState } from '@/components/pages/task/TaskPage';
import { TIME } from '@/consts';

type Props = {
  state: TaskState;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  taskId: string;
};

const POSITION = 2;

export const Timer = ({ state: mode, time, setTime, taskId }: Props) => {
  useEffect(() => {
    if (mode !== 'TIMER') return;
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, TIME.SECOND);
    return () => {
      clearInterval(interval);
    };
  }, [mode, setTime]);

  useEffect(() => {
    localStorage.setItem(`timer_time_${taskId}`, time.toString());
  }, [time, taskId]);

  const hours = String(
    Math.floor(time / TIME.MINUTE_IN_HOUR / TIME.SECONDS_IN_MINUTE),
  ).padStart(POSITION, '0');
  const minutes = String(
    Math.floor((time % TIME.MINUTE_IN_HOUR) / TIME.SECONDS_IN_MINUTE),
  ).padStart(POSITION, '0');
  const seconds = String(time % TIME.SECONDS_IN_MINUTE).padStart(POSITION, '0');

  return (
    <div className='flex items-center justify-center flex-col gap-4'>
      {mode === 'TIMER' && <LapTimerIcon className='size-10' />}

      {mode === 'PAUSE' && <PauseIcon className='size-10' />}

      {mode === 'COMPLETE' && (
        <>
          <CheckIcon className='size-10' />
          <p>Вы занимались</p>
        </>
      )}

      <h2 className='text-4xl font-bold'>
        {hours} : {minutes} : {seconds}
      </h2>

      <p className='italic text-gray-500'>
        {mode === 'COMPLETE' ? 'Отличная работа!' : 'У вас всё получится!'}
      </p>
      {mode === 'COMPLETE' && <h3>😁Улыбнитесь себе!😁</h3>}
    </div>
  );
};
