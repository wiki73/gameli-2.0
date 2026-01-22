import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { FullScreenSpinner, Spinner } from '@ui/spinner';
import dayjs from 'dayjs';
import { TaskItem } from '@/components/entities/Task/Task';
import type { Nullable } from '@/api/types';
import { api } from '@/api/api';
import { getFormattedDay, toCalendarDate } from '@/utils/date';
import type { Day } from '@/api/days/types';
import { useAuth } from '../../../contexts/auth-context';
import { CategoryBlock } from '../../widgets/CategoryBlock/CategoryBlock';
import { DaySelection } from './DaySelection/DaySelection';
import { TaskCreateEditDialog } from './TaskCreateEditDialog/TaskCreateEditDialog';

export const MainPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState<Nullable<Day>>();

  const { data: days, isPending: isDaysPending } = useQuery({
    queryKey: ['days', user?.id],
    queryFn: () => api.days.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const { data: categories, isPending: isCategoriesPending } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.categories.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', user?.id, selectedDay],
    queryFn: () =>
      api.tasks.getMany({
        userId: user?.id ?? '',
        day_id: selectedDay?.id ?? days?.[0]?.id,
      }),
    enabled: !!user?.id && !!selectedDay,
  });

  const hasCategories = !!categories?.length;
  const hasTasks = !!tasks?.length;
  const hasDays = !!days?.length;

  useEffect(() => {
    if (!!days?.length) {
      setSelectedDay(
        days.find(
          day => toCalendarDate(day.date) === toCalendarDate(new Date()),
        ),
      );
    }
  }, [days]);

  const title = useMemo(() => {
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
  }, [hasCategories, hasDays, hasTasks, selectedDay]);

  const description = useMemo(() => {
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
  }, [hasCategories, hasDays, hasTasks, selectedDay]);

  if (isDaysPending) {
    return <FullScreenSpinner />;
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-4'>
            {!!days && (
              <DaySelection
                days={days}
                onSuccess={setSelectedDay}
                selectedDay={selectedDay}
              />
            )}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {selectedDay && (
          <CardContent className='grid md:grid-cols-2 gap-4'>
            {tasks?.map(task => (
              <TaskItem
                isBlocked={dayjs(toCalendarDate(selectedDay.date)).isBefore(
                  toCalendarDate(new Date()),
                )}
                key={task.id}
                selectedDay={selectedDay}
                task={task}
              />
            ))}
            {!isLoading && !!days?.length && !!categories?.length && (
              <TaskCreateEditDialog selectedDay={selectedDay} />
            )}
            {isLoading && <Spinner />}
          </CardContent>
        )}
      </Card>
      {!!categories && (
        <CategoryBlock
          categories={categories}
          isPending={isCategoriesPending}
        />
      )}
    </>
  );
};
