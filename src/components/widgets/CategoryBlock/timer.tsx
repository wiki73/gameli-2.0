import { CheckIcon, LapTimerIcon, PauseIcon } from '@radix-ui/react-icons';
import type { TaskState } from '@/components/pages/task/task-page';
import { TIME } from '@/consts';

type Props = {
  state: TaskState;
  time: number;
  // setLocalTask: React.Dispatch<
  //   React.SetStateAction<Nullable<TaskWithCategory>>
  // >;
};
const TICK_INTERVAL = 1000;

const POSITION = 2;

export const Timer = ({ state: mode, time }: Props) => {
  const totalSeconds = Math.floor(time / TICK_INTERVAL);
  const hours = String(
    Math.floor(totalSeconds / (TIME.SECONDS_IN_MINUTE * TIME.MINUTE_IN_HOUR)),
  ).padStart(POSITION, '0');

  const minutes = String(
    Math.floor((totalSeconds / TIME.SECONDS_IN_MINUTE) % TIME.MINUTE_IN_HOUR),
  ).padStart(POSITION, '0');

  const seconds = String(totalSeconds % TIME.SECONDS_IN_MINUTE).padStart(
    POSITION,
    '0',
  );

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
};
