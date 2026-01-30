import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { habitApi } from '@/api/habits';
import { useAuth } from '../../../contexts/auth';
import { HabitCreateEditDialog } from './habits-create-edit-dialog';
import { HabitCard } from './habit-card';

const SUCCESS_MESSAGE_TIMEOUT = 3000;

export const HabitsPage = () => {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const {
    data: habitsData,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ['habits', userId],
    queryFn: () => {
      if (!userId) throw new Error('Пользователь не авторизован');
      return habitApi.getMany({ userId });
    },
    enabled: !!userId,
  });

  const habits = habitsData?.data || [];

  if (!userId) {
    return <div className='p-8 text-center'>Пожалуйста, авторизуйтесь</div>;
  }

  if (isLoading) {
    return <div className='p-8 text-center'>Загрузка...</div>;
  }

  if (loadError) {
    return (
      <div className='p-8 text-center text-red-500'>
        Ошибка загрузки привычек: {loadError.message}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='pt-4 pl-4 text-4xl'>Привычки</CardTitle>
        <HabitCreateEditDialog modeForm='CREATE' />
      </CardHeader>

      <CardContent>
        {error && (
          <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md'>
            {error}
          </div>
        )}

        {successMessage && (
          <div className='mb-4 p-3 bg-green-50 text-green-700 rounded-md'>
            {successMessage}
          </div>
        )}

        {habits.length === 0 ? (
          <div className='text-center p-8 text-muted-foreground'>
            У вас пока нет привычек. Создайте первую!
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard
              habit={habit}
              key={habit.id}
              onError={errorMessage => {
                setError(errorMessage);
              }}
              onSuccessMessage={message => {
                setSuccessMessage(message);
                setTimeout(() => {
                  setSuccessMessage(null);
                }, SUCCESS_MESSAGE_TIMEOUT);
              }}
              userId={userId}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
