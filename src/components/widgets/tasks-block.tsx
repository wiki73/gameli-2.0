import { getFormattedDay } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { Day, Task } from '../../../generated/prisma';

type Props = {
  tasks: Task[];
  hasCategories: boolean;
  hasDays: boolean;
};

const getTitle = ({
  hasCategories,
  hasDays,
  hasTasks,
  selectedDay,
}: {
  hasCategories: boolean;
  hasDays: boolean;
  hasTasks: boolean;
  selectedDay?: Day;
}) => {
  switch (true) {
    case !hasCategories:
      return 'Нет доступа к задачам';
    case !hasDays:
      return 'Не выбрана дата';
    case !hasTasks && !!selectedDay:
      return `Нет задач на ${getFormattedDay(selectedDay?.date)}`;
    case !!selectedDay:
      return `Задачи на ${getFormattedDay(selectedDay?.date)}`;
    default:
      return 'Выберите день';
  }
};

const getDescription = ({
  hasCategories,
  hasDays,
  hasTasks,
  selectedDay,
}: {
  hasCategories: boolean;
  hasDays: boolean;
  hasTasks: boolean;
  selectedDay?: Day;
}) => {
  switch (true) {
    case !hasCategories:
      return 'Вы не создали ни одной категории, нажмите кнопку ниже, чтобы создать';
    case !hasDays:
      return 'Выберите дату и начните планировать задачи';
    case !hasTasks && !!selectedDay:
      return 'Вы не создали ни одной задачи, нажмите кнопку ниже, чтобы создать первую!';
    default:
      return 'Выберите день и начните планировать задачи';
  }
};

export const TasksBlock = ({ tasks, hasCategories, hasDays }: Props) => (
  <Card className='w-full'>
    <CardHeader>
      <CardTitle>
        {getTitle({ hasCategories, hasDays, hasTasks: !!tasks.length })}
      </CardTitle>
      <CardDescription>
        {getDescription({ hasCategories, hasDays, hasTasks: !!tasks.length })}
      </CardDescription>
    </CardHeader>
    {tasks.map(task => (
      <div key={task.id}>{task.name}</div>
    ))}
  </Card>
);
