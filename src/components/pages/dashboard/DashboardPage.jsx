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
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { getFormattedDay } from '../../../utils/date';
import { Card } from '../../common/Card/Card';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data: tasks, isPending: isPendingTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => api.tasks.getMany({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const { data: categories, isPending: isPendingCategories } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.categories.getMany({ userId: user?.id }),
    enabled: !!user?.id,
  });
  const taskChartData = useMemo(
    () =>
      tasks?.reduce((acc, task) => {
        const day = getFormattedDay(task.date, 'D MMM');

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

  if (isPendingTasks || isPendingCategories) {
    return <FullScreenSpinner />;
  }

  return (
    <Card className={styles.page}>
      <Card className={styles.block}>
        <h4>Задачи</h4>
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
      </Card>
      <Card className={styles.block}>
        <h4>Уровень по категориям</h4>

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
      </Card>
      <Card className={styles.block}>
        <h4>Опыт по категориям</h4>

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
      </Card>
    </Card>
  );
};
