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
import type { Category } from '@/generated/prisma';

export const CategoryExperienceChart = ({
  categories,
}: {
  categories: Pick<Category, 'name' | 'level' | 'experience'>[];
}) => (
  <ChartContainer
    className='h-[200px] w-full sm:h-[250px]'
    config={chartConfig}
  >
    <BarChart
      accessibilityLayer
      data={categories}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        angle={-45}
        axisLine={false}
        dataKey='name'
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
        fill='var(--color-experience)'
        radius={4}
      />
    </BarChart>
  </ChartContainer>
);
