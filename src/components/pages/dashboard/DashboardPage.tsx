import { RechartsDevtools } from '@recharts/devtools';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { NavLink } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/api/api';
import { FullScreenSpinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { getFormattedDay } from '@/lib/date';
import { getQueryKey, QUERY_KEY_TYPES, ROUTES } from '@/consts';
import { useAuth } from '../../../contexts/auth-context';

type TaskChartDataItem = {
  name: string;
  total: number;
  completed: number;
};

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data: tasks, isPending: isPendingTasks } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.USER_TASKS,
      payload: { userId: user?.id ?? '' },
    }),
    queryFn: () => api.tasks.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const { data: categories, isPending: isPendingCategories } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.CATEGORIES,
      payload: { userId: user?.id ?? '' },
    }),
    queryFn: () => api.categories.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });
  const taskChartData = useMemo(
    () =>
      tasks?.reduce((acc: TaskChartDataItem[], task) => {
        const day = getFormattedDay(task.day?.date ?? new Date(), 'D MMM');

        const existing = acc.find(item => item.name === day);

        if (existing) {
          existing.total += 1;
          if (task.is_done) {
            existing.completed += 1;
          }
        } else {
          acc.push({
            name: day,
            total: 1,
            completed: task.is_done ? 1 : 0,
          });
        }

        return acc;
      }, []) || [],
    [tasks],
  );

  const categoriesChartData = useMemo(
    () =>
      categories?.map(category => ({
        name: category.name,
        level: category.level,
        experience: category.experience,
      })) || [],
    [categories],
  );

  const showTasksChart =
    taskChartData.length > 0 && taskChartData.some(item => item.completed);
  const showCategoryLevelChart =
    categoriesChartData.length > 0 &&
    categoriesChartData.some(item => item.level > 1);
  const showCategoryExperienceChart =
    categoriesChartData.length > 0 &&
    categoriesChartData.some(item => item.experience > 0);

  if (isPendingTasks || isPendingCategories) {
    return <FullScreenSpinner />;
  }

  if (
    !showTasksChart ||
    !showCategoryLevelChart ||
    !showCategoryExperienceChart
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Недостаточно данных</CardTitle>
          <CardDescription>
            Выполните больше задач и прокачайте категории, чтобы увидеть
            статистику
          </CardDescription>
          <NavLink to={ROUTES.MAIN}>
            <Button variant='outline'>К планированию</Button>
          </NavLink>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      {!showTasksChart &&
        !showCategoryLevelChart &&
        !showCategoryExperienceChart && (
          <>
            <h1>Нет данных</h1>
            <p>
              Начните пользоватся приложением, чтобы получить доступ к
              статистике
            </p>
          </>
        )}
      <CardContent className='flex flex-col gap-4'>
        {showTasksChart && (
          <>
            <CardHeader>
              <CardTitle>Задачи</CardTitle>
            </CardHeader>
            <LineChart
              data={taskChartData}
              style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
            >
              <CartesianGrid strokeDasharray='3 3' />

              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />

              <Line
                dataKey='total'
                name='Всего'
                stroke='purple'
                type='monotone'
              />

              <Line
                dataKey='completed'
                name='Выполнено'
                stroke='green'
                type='monotone'
              />

              <Legend />
              <RechartsDevtools />
            </LineChart>
          </>
        )}
        {showCategoryLevelChart && (
          <>
            <CardHeader>
              <CardTitle>Уровень по категориям</CardTitle>
            </CardHeader>

            <BarChart
              data={categoriesChartData}
              style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
            >
              <CartesianGrid strokeDasharray='3 3' />

              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />

              <Bar
                dataKey='level'
                fill='purple'
                name='Уровень'
              />

              <Legend />
            </BarChart>
          </>
        )}
        {showCategoryExperienceChart && (
          <>
            <CardHeader>
              <CardTitle>Опыт по категориям</CardTitle>
            </CardHeader>

            <BarChart
              data={categoriesChartData}
              style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
            >
              <CartesianGrid strokeDasharray='3 3' />

              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />

              <Bar
                dataKey='experience'
                fill='green'
                name='Опыт'
              />

              <Legend />
            </BarChart>
          </>
        )}
      </CardContent>
    </Card>
  );
};
