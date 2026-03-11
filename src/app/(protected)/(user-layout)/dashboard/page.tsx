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
    orderBy: { updatedAt: 'desc' },    
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
    <div className='w-full md:w-6xl px-2 py-2 sm:px-4 sm:py-4'>
      <div className='mb-4 w-full sm:mb-6'>
        <CategoriesBlock categories={categories} />
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2'>
        <Card className='w-full'>
          <CardHeader className='px-3 py-2 sm:px-6 sm:py-4'>
            <CardTitle className='text-base sm:text-lg'>Опыта в день</CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Количество опыта по дням
            </CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:px-6'>
            <DayExperienceChart taskChartData={taskChartData} />
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className='px-3 py-2 sm:px-6 sm:py-4'>
            <CardTitle className='text-base sm:text-lg'>
              Выполнение задач
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Количество выполнених задач по дням
            </CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:px-6'>
            <TasksChart taskChartData={taskChartData} />
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className='px-3 py-2 sm:px-6 sm:py-4'>
            <CardTitle className='text-base sm:text-lg'>
              Уровень по категориям
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Уровень распределенный по категориям
            </CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:px-6'>
            <CategoryLevelChart categories={categories} />
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className='px-3 py-2 sm:px-6 sm:py-4'>
            <CardTitle className='text-base sm:text-lg'>
              Опыт по категориям
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Количество опыта распределеного по категориям
            </CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:px-6'>
            <CategoryExperienceChart categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
