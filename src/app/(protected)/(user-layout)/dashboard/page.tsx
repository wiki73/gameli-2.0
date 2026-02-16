import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { headers } from 'next/headers';
import prisma from '@/src/server/db';
import { auth } from '@/src/server/auth';
import { getFormattedDay } from '@/src/lib/date';
import { TaskStatus } from '@/generated/prisma';
import { CategoriesBlock } from '@/src/components/categories/categories-block';
import { TasksChart } from './tasks-chart';
import { CategoryLevelChart } from './category-level-chart';
import { CategoryExperienceChart } from './category-experience-chart';
import { DayExperienceChart } from './day-experience-chart';

export type TaskChartDataItem = {
  date: string;
  total: number;
  completed: number;
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const tasks = await prisma.task.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      date: 'asc',
    },
    select: {
      date: true,
      status: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      userId: session?.user.id,
    },
    // select: {
    //   name: true,
    //   level: true,
    //   experience: true,
    // },
  });

  const taskChartData = tasks?.reduce((acc: TaskChartDataItem[], task) => {
    const date = getFormattedDay(task.date ?? new Date(), 'D MMM');

    const existing = acc.find(item => item.date === date);

    const isCompleted = task.status === TaskStatus.COMPLETED;

    if (existing) {
      existing.total += 1;
      if (isCompleted) {
        existing.completed += 1;
      }
    } else {
      acc.push({
        date,
        total: 1,
        completed: isCompleted ? 1 : 0,
      });
    }

    return acc;
  }, []);

  return (
    <div>
      <div className='mb-6 w-full'>
        <CategoriesBlock categories={categories} />
      </div>

      <div className='flex w-full flex-wrap gap-4'>
        <Card className='min-w-xl flex-1'>
          <CardHeader>
            <CardTitle>Опыта в день</CardTitle>
            <CardDescription>Количество опыта по дням</CardDescription>
          </CardHeader>
          <CardContent>
            <DayExperienceChart taskChartData={taskChartData} />
          </CardContent>
        </Card>
        <Card className='min-w-xl flex-1'>
          <CardHeader>
            <CardTitle>Выполнение задач</CardTitle>
            <CardDescription>
              Количество выполнених задач по дням
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TasksChart taskChartData={taskChartData} />
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Уровень по категориям</CardTitle>
            <CardDescription>
              Уровень распределенный по категориям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryLevelChart categories={categories} />
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Опыт по категориям</CardTitle>
            <CardDescription>
              Количество опыта распределеного по категориям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryExperienceChart categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
