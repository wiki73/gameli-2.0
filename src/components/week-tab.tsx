import type { Task } from '@/generated/prisma';
import dayjs from '../lib/dayjs';
import { groupTasksByWeekday } from '../lib/task';
import { WEEK_DAYS } from '../consts';
import { Weekday } from './weekday';

type Props = {
  tasks: Task[];
};

const FIRST_COLUMN_START = 0;
const FIRST_COLUMN_END = 3;
const SECOND_COLUMN_START = 3;
const SECOND_COLUMN_END = 7;

export const WeekTab = ({ tasks }: Props) => {
  const tasksByDay = groupTasksByWeekday(tasks);
  const weekStart = dayjs().startOf('isoWeek');
  const today = dayjs().isoWeekday();

  const firstColumn = WEEK_DAYS.slice(FIRST_COLUMN_START, FIRST_COLUMN_END);
  const secondColumn = WEEK_DAYS.slice(SECOND_COLUMN_START, SECOND_COLUMN_END);

  const renderDay = ({ label, value }: (typeof WEEK_DAYS)[0]) => (
    <Weekday
      date={weekStart.add(value - 1, 'day').toDate()}
      isToday={today === value}
      key={value}
      tasks={tasksByDay[value] ?? []}
      title={label}
    />
  );

  return (
    <div className='flex flex-col md:flex-row  w-full  gap-4 md:gap-6'>
      <div className='flex flex-col w-full gap-4 md:gap-4'>
        {firstColumn.map(renderDay)}
      </div>
      <div className='flex flex-col w-full gap-4 md:gap-4'>
        {secondColumn.map(renderDay)}
      </div>
    </div>
  );
};
