import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@ui/calendar';
import { Calendar1 } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '@/api/api';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import type { Day } from '@/api/days/types';
import type { Nullable } from '@/api/types';
import { toCalendarDate } from '@/lib/date';
import { enqueueMutation } from '@/contexts/query/persist';
import { getQueryKey, QUERY_KEY_TYPES } from '@/consts';

type Props = {
  onSuccess: (date: Day) => void;
  selectedDay: Nullable<Day>;
  days: Day[];
  tasksPage: number;
};

export const DaySelection = ({
  onSuccess,
  selectedDay,
  days,
  tasksPage,
}: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const createDayListMutation = useMutation<
    { offline: boolean },
    unknown,
    { userId: string; date: Date }
  >({
    mutationFn: async dayData => {
      if (!navigator.onLine) {
        await enqueueMutation({ type: 'createDay', payload: dayData });
        return { offline: true };
      }

      await api.days.create(dayData);

      return { offline: false };
    },
    onMutate: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.DAYS,
          payload: { userId: user?.id ?? '' },
        }),
        exact: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.TASKS,
          payload: {
            userId: user?.id ?? '',
            dayId: selectedDay?.id ?? '',
            page: tasksPage,
          },
        }),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.DAYS,
          payload: { userId: user?.id ?? '' },
        }),
        exact: false,
      });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDaySelect = (date: Date) => {
    const day = days.find(
      day => toCalendarDate(day.date) === toCalendarDate(date),
    );

    if (!day) {
      createDayListMutation.mutate({
        userId: user?.id ?? '',
        date,
      });
    } else {
      onSuccess(day);
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.TASKS,
          payload: {
            userId: user?.id ?? '',
            dayId: day?.id ?? '',
            page: tasksPage,
          },
        }),
        exact: false,
      });
    }
    setOpen(false);
  };

  return (
    <div
      className='relative'
      ref={containerRef}
    >
      <Button
        onClick={() => {
          setOpen(!open);
        }}
        size='icon'
      >
        <Calendar1 />
      </Button>
      {open && (
        <Calendar
          className='rounded-lg border absolute top-10 z-10'
          disabled={[
            days
              .filter(
                day =>
                  day.tasks[0]?.count === 0 &&
                  dayjs(day.date).isBefore(toCalendarDate(new Date())),
              )
              .map(day => new Date(day.date)),
            {
              before:
                days.filter(day => day.tasks[0]?.count ?? 0 > 0)[0]?.date ??
                new Date(),
            },
          ]}
          mode='single'
          onSelect={handleDaySelect}
          required
          selected={selectedDay?.date}
          timeZone='+03:00'
        />
      )}
    </div>
  );
};
