import { headers } from 'next/headers';
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

export default async function CalendarPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const startOfWeek = dayjs().startOf('isoWeek').toDate();
  const endOfWeek = dayjs().endOf('isoWeek').toDate();

  const tasks = await prisma.task.findMany({
    where: {
      userId: session?.user.id,
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return (
    <div className='flex h-full w-full flex-[1_1_auto] flex-col'>
      <Tabs
        className='h-full flex-[1_1_auto]'
        defaultValue='week'
      >
        <TabsList>
          {Object.values(tabs).map(({ label, value }) => (
            <TabsTrigger
              disabled={value !== 'week'}
              key={value}
              value={value}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          className='flex h-full flex-1'
          value={tabs.week.value}
        >
          <WeekTab tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
