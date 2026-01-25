import { CheckIcon, LapTimerIcon, PauseIcon } from '@radix-ui/react-icons';
import { memo, useEffect } from 'react';
import type { TaskState } from '@/components/pages/task/task-page';
import { TIME } from '@/consts';
import type { Nullable } from '@/api/types';
import type { TaskWithCategory } from '@/api/tasks/types';

type Props = {
  state: TaskState;
  time: number;
  setLocalTask: React.Dispatch<
    React.SetStateAction<Nullable<TaskWithCategory>>
  >;
};

const POSITION = 2;

export const Timer = memo(({ state: mode, time, setLocalTask }: Props) => {
  useEffect(() => {
    if (mode !== 'TIMER') return;
    const interval = setInterval(() => {
      setLocalTask(prev => (!!prev ? { ...prev, time: prev?.time + 1 } : prev));
    }, TIME.SECOND);
    return () => {
      clearInterval(interval);
    };
  }, [mode, setLocalTask]);

  const hours = String(
    Math.floor(time / (TIME.SECONDS_IN_MINUTE * TIME.MINUTE_IN_HOUR)),
  ).padStart(POSITION, '0');
  const minutes = String(
    Math.floor((time / TIME.SECONDS_IN_MINUTE) % TIME.MINUTE_IN_HOUR),
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

      <h2 className='text-4xl font-bold tabular-nums'>
        {hours} : {minutes} : {seconds}
      </h2>

      <p className='italic text-gray-500'>
        {mode === 'COMPLETE' ? 'Отличная работа!' : 'У вас всё получится!'}
      </p>
      {mode === 'COMPLETE' && <h3>😁Улыбнитесь себе!😁</h3>}
    </div>
  );
});
