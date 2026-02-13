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
import type { Category } from '@/generated/prisma';

export const CategoryExperienceChart = ({
  categories,
}: {
  categories: Pick<Category, 'name' | 'level' | 'experience'>[];
}) => (
  <ChartContainer
    className='min-h-50 w-full'
    config={chartConfig}
  >
    <BarChart
      accessibilityLayer
      data={categories}
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
);
