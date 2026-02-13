'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/src/components/ui/chart';
import { chartConfig } from '@/src/consts';
import type { TaskChartDataItem } from './page';

export const TasksChart = ({
  taskChartData,
}: {
  taskChartData: TaskChartDataItem[];
}) => (
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
        dataKey='date'
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
);
