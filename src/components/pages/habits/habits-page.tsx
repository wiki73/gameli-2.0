import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { habitApi } from '@/api/habits';
import { useAuth } from '../../../contexts/auth';
import { HabitCard } from './habit-card';

const SUCCESS_MESSAGE_TIMEOUT = 3000;

export const HabitsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      if (!userId) throw new Error('Пользователь не авторизован');
      return habitApi.create({
        user_id: userId,
        title: data.title,
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      setNewHabit({ title: '', description: '' });
      setIsCreating(false);
      setSuccessMessage('Привычка создана успешно!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, SUCCESS_MESSAGE_TIMEOUT);
    },
    onError: () => {
      setError('Не удалось создать привычку');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!userId) throw new Error('Пользователь не авторизован');
      return habitApi.delete({ id: habitId, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      setSuccessMessage('Привычка удалена');
      setTimeout(() => {
        setSuccessMessage(null);
      }, SUCCESS_MESSAGE_TIMEOUT);
    },
    onError: () => {
      setError('Не удалось удалить привычку');
    },
  });

  const handleCreateHabit = () => {
    if (!newHabit.title.trim()) {
      setError('Введите название привычки');
      return;
    }
    setError(null);
    createMutation.mutate({
      title: newHabit.title,
      description: newHabit.description || undefined,
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteMutation.mutate(habitId);
  };

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
        <CardTitle className='pt-4 pl-4 text-3xl'>21 День Привычек</CardTitle>
        <Button
          onClick={() => {
            setIsCreating(true);
          }}
        >
          + Новая привычка
        </Button>
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

        {isCreating && (
          <Card className='mb-8'>
            <CardContent className='pt-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Название привычки *
                  </label>
                  <Input
                    className='w-full'
                    onChange={e => {
                      setNewHabit(prev => ({ ...prev, title: e.target.value }));
                    }}
                    placeholder='Например: Зарядка утром'
                    value={newHabit.title}
                  />
                </div>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Описание (необязательно)
                  </label>
                  <Input
                    className='w-full'
                    onChange={e => {
                      setNewHabit(prev => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                    placeholder='Опишите вашу привычку...'
                    value={newHabit.description}
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    disabled={createMutation.isPending}
                    onClick={handleCreateHabit}
                  >
                    {createMutation.isPending ? 'Создание...' : 'Создать'}
                  </Button>
                  <Button
                    disabled={createMutation.isPending}
                    onClick={() => {
                      setIsCreating(false);
                      setNewHabit({ title: '', description: '' });
                      setError(null);
                    }}
                    variant='outline'
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
              onDelete={() => {
                handleDeleteHabit(habit.id);
              }}
              userId={userId}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
