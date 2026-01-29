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
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { TaskItem } from '@/components/entities/task';
import type { Nullable } from '@/api/types';
import { api } from '@/api/api';
import type { Day } from '@/api/days/types';
import { getFormattedDay, toCalendarDate } from '@/lib/date';
import { getQueryKey, PAGE_SIZES, QUERY_KEY_TYPES } from '@/consts';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../../contexts/auth';
import { CategoryBlock } from '../../widgets/CategoryBlock/category-block';
import { DaySelection } from './day-selection';
import { TaskCreateEditDialog } from './task-create-edit-dialog';

export const MainPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState<Nullable<Day>>();
  const [tasksPage, setTasksPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);

  const { data: days, isPending: isDaysPending } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.DAYS,
      payload: { userId: user?.id ?? '' },
    }),
    queryFn: () => api.days.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const {
    data: { data: categories = [], total: categoriesTotal = 0 } = {},
    isPending: isCategoriesPending,
    isFetching: isCategoriesFetching,
  } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.CATEGORIES,
      payload: { userId: user?.id ?? '', page: categoriesPage },
    }),
    queryFn: () =>
      api.categories.getMany({
        userId: user?.id ?? '',
        page: categoriesPage,
        limit: PAGE_SIZES[QUERY_KEY_TYPES.CATEGORIES],
      }),
    enabled: !!user?.id && !!categoriesPage,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const {
    data: { data: tasks = [], total: tasksTotal = 0 } = {},
    isFetching: isTasksFetching,
    isPending: isTasksPending,
  } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.TASKS,
      payload: {
        userId: user?.id ?? '',
        dayId: selectedDay?.id ?? '',
        page: tasksPage,
      },
    }),
    queryFn: () =>
      api.tasks.getMany({
        userId: user?.id ?? '',
        day_id: selectedDay?.id ?? days?.[0]?.id,
        page: tasksPage,
        limit: PAGE_SIZES[QUERY_KEY_TYPES.TASKS],
      }),
    enabled: !!user?.id && !!selectedDay,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const hasCategories = !!categories?.length;
  const hasTasks = !!tasks?.length;
  const hasDays = !!days?.length;
  const showTasksPagination = tasksTotal > PAGE_SIZES[QUERY_KEY_TYPES.TASKS];
  const showCategoriesPagination =
    categoriesTotal > PAGE_SIZES[QUERY_KEY_TYPES.CATEGORIES];

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
                tasksPage={tasksPage}
              />
            )}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {selectedDay && (
          <CardContent className='flex flex-col gap-4 w-full'>
            <div className='grid md:grid-cols-2 gap-2'>
              {tasks?.map(task => (
                <TaskItem
                  categoriesPage={categoriesPage}
                  isBlocked={dayjs(toCalendarDate(selectedDay.date)).isBefore(
                    toCalendarDate(new Date()),
                  )}
                  key={task.id}
                  selectedDay={selectedDay}
                  task={task}
                  tasksPage={tasksPage}
                />
              ))}
            </div>
            {showTasksPagination && (
              <div className='flex justify-between items-center'>
                <Button
                  disabled={tasksPage === 1}
                  onClick={() => {
                    setTasksPage(p => p - 1);
                  }}
                  size='icon'
                  variant='outline'
                >
                  <ArrowLeftIcon />
                </Button>
                <span>
                  Страница {tasksPage}
                  {isTasksFetching && ' • обновление…'}
                </span>
                <Button
                  disabled={tasks.length < PAGE_SIZES[QUERY_KEY_TYPES.TASKS]}
                  onClick={() => {
                    setTasksPage(p => p + 1);
                  }}
                  size='icon'
                  variant='outline'
                >
                  <ArrowRightIcon />
                </Button>
              </div>
            )}
            {!isTasksPending && !!days?.length && !!categories?.length && (
              <TaskCreateEditDialog
                page={tasksPage}
                selectedDay={selectedDay}
              />
            )}
            {isTasksPending && <Spinner />}
          </CardContent>
        )}
      </Card>
      {!!categories && (
        <CategoryBlock
          categories={categories}
          categoriesPage={categoriesPage}
          dayId={selectedDay?.id}
          isFetching={isCategoriesFetching}
          isPending={isCategoriesPending}
          setPage={setCategoriesPage}
          showPagination={showCategoriesPagination}
          tasksPage={tasksPage}
        />
      )}
    </>
  );
};
