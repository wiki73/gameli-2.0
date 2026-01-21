import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Calendar } from '@ui/calendar';
import { Calendar1 } from 'lucide-react';
import { api } from '@/api/api';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Day } from '@/api/days/types';
import { toCalendarDate } from '@/utils/date';

type Props = {
  onSuccess: (date: Day) => void;
  selectedDay?: Day;
  days: Day[];
};

export const DaySelection = ({ onSuccess, selectedDay, days }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const createDayListMutation = useMutation({
    mutationFn: api.days.create,
    onMutate: () => {
      queryClient.invalidateQueries({
        queryKey: ['days', user?.id],
        exact: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id],
        exact: false,
      });
    },
  });

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
        queryKey: ['tasks', user?.id, day],
        exact: false,
      });
    }
    setOpen(false);
  };

  return (
    <div className='relative'>
      <Button
        onClick={() => setOpen(!open)}
        size='icon'
      >
        <Calendar1 />
      </Button>
      {open && (
        <Calendar
          className='rounded-lg border absolute top-10 z-10'
          disabled={{ before: new Date() }}
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
