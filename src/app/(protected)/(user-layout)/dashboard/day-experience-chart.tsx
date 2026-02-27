'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/src/components/ui/chart';
import { chartConfig } from '@/src/consts';
import type { TaskChartDataItem } from './page';

export const DayExperienceChart = ({
  taskChartData,
}: {
  taskChartData: TaskChartDataItem[];
}) => (
  <ChartContainer
    className='h-[200px] w-full sm:h-[250px]'
    config={chartConfig}
  >
    <BarChart
      accessibilityLayer
      data={taskChartData}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        angle={-45}
        axisLine={false}
        dataKey='date'
        height={60}
        interval={0}
        textAnchor='end'
        tick={{ fontSize: 10 }}
        tickLine={false}
        tickMargin={8}
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar
        dataKey='experience'
        fill='var(--color-total)'
        radius={4}
      />
    </BarChart>
  </ChartContainer>
);
