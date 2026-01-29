import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { type ChartConfig } from '@/components/ui/chart';
import { useAuth } from '../../../contexts/auth';

type TaskChartDataItem = {
  name: string;
  total: number;
  completed: number;
};

const chartConfig = {
  total: {
    label: 'Всего',
    theme: {
      light: 'var(--chart-light-3)',
      dark: 'var(--chart-dark-1)',
    },
  },
  completed: {
    label: 'Выполнено',
    theme: {
      light: 'var(--chart-light-2)',
      dark: 'var(--chart-dark-2)',
    },
  },
  level: {
    label: 'Уровень',
    theme: {
      light: 'var(--chart-light-3)',
      dark: 'var(--chart-dark-1)',
    },
  },
  experience: {
    label: 'Опыт',
    theme: {
      light: 'var(--chart-light-2)',
      dark: 'var(--chart-dark-2)',
    },
  },
} satisfies ChartConfig;

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data: { data: tasks = [] } = {}, isPending: isPendingTasks } =
    useQuery({
      queryKey: getQueryKey({
        type: QUERY_KEY_TYPES.USER_TASKS,
        payload: { userId: user?.id ?? '' },
      }),
      queryFn: () => api.tasks.getMany({ userId: user?.id ?? '' }),
      enabled: !!user?.id,
      staleTime: 0,
      refetchOnMount: 'always',
    });

  const {
    data: { data: categories = [] } = {},
    isPending: isPendingCategories,
  } = useQuery({
    queryKey: getQueryKey({
      type: QUERY_KEY_TYPES.CATEGORIES,
      payload: { userId: user?.id ?? '', page: 'all' },
    }),
    queryFn: () => api.categories.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: 'always',
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
        <h1 className='font-bolf text-2xl'>Выполнение задач</h1>
        <ChartContainer
          className='min-h-50 w-full'
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={taskChartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='name'
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Bar
              dataKey='total'
              fill='var(--color-total)'
              radius={4}
            />
            <Bar
              dataKey='completed'
              fill='var(--color-completed)'
              radius={4}
            />
          </BarChart>
        </ChartContainer>
        <h1 className='font-bolf text-2xl'>Уровень по категориям</h1>
        <ChartContainer
          className='min-h-50 w-full'
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={categoriesChartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='name'
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Bar
              dataKey='level'
              fill='var(--color-level)'
              radius={4}
            />
          </BarChart>
        </ChartContainer>
        <h1 className='font-bolf text-2xl'>Опыт по категориям</h1>
        <ChartContainer
          className='min-h-50 w-full'
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={categoriesChartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='name'
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Bar
              dataKey='experience'
              fill='var(--color-experience)'
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
