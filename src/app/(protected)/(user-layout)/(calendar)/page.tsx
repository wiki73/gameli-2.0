import { headers } from 'next/headers';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { auth } from '@/src/server/auth';
import prisma from '@/src/server/db';
import { WeekTab } from '@/src/components/week-tab';
import dayjs from '@/src/lib/dayjs';

type TabType = {
  label: string;
  value: string;
};

const tabs: Record<'day' | 'week' | 'month', TabType> = {
  day: {
    label: 'День',
    value: 'day',
  },
  week: {
    label: 'Неделя',
    value: 'week',
  },
  month: {
    label: 'Месяц',
    value: 'month',
  },
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab: 'day' | 'week' | 'month' }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-useless-default-assignment
  const { tab = 'week' } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });

  const unit = tab === 'week' ? 'isoWeek' : tab; // dayjs использует 'day', 'week', 'month'
  const startDate = dayjs().startOf(unit).toDate();
  const endDate = dayjs().endOf(unit).toDate();

  const tasks = await prisma.task.findMany({
    where: {
      userId: session?.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return (
    <div className='flex h-full w-full flex-1 flex-col p-2 md:w-6xl'>
      <Tabs
        className='flex h-full flex-1 flex-col'
        value={tab}
      >
        <TabsList className='mb-2 sm:mb-1'>
          {Object.values(tabs).map(({ label, value }) => (
            <TabsTrigger
              asChild
              className='text-xs sm:text-sm'
              disabled={value !== 'week'}
              key={value}
              value={value}
            >
              <Link href={`?tab=${value}`}>{label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          className='flex h-full flex-1 flex-col'
          value={tabs.week.value}
        >
          <WeekTab tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
