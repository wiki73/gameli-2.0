import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Select } from '@radix-ui/react-select';
import { Task } from '@/components/entities/Task/Task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { getFormattedDay } from '../../../utils/date';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import { Spinner } from '../../common/spinner/Spinner';
import { CategoryBlock } from '../../widgets/CategoryBlock/CategoryBlock';
import { CreateDayListModal } from './CreateDayListModal/CreateDayListModal';
import { CreateTaskModal } from './CreateTaskModal/CreateTaskModal';
import styles from './MainPage.module.pcss';

export const MainPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: days, isPending: isDaysPending } = useQuery({
    queryKey: ['days', user?.id],
    queryFn: () => api.days.getMany({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const { data: categories, isPending: isCategoriesPending } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.categories.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const {
    data: tasks,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['tasks', user?.id, selectedDay],
    queryFn: () =>
      api.tasks.getMany({
        userId: user?.id,
        date: selectedDay ?? days[0].date,
      }),
    enabled: !!user?.id && !!selectedDay,
  });

  useEffect(() => {
    if (days?.length) {
      setSelectedDay(days[0].date);
    }
  }, [days, refetch]);

  const handleDayChange = async value => {
    setSelectedDay(value);
  };

  const handleCreateNewDay = () => {
    openModal();
  };

  // const handleCreateTask = () => {
  //   setIsCreateTaskModalOpen(true);
  // };

  // const handleCloseCreateTaskModal = () => {
  //   setIsCreateTaskModalOpen(false);
  // };

  if (isDaysPending) {
    return <FullScreenSpinner />;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className='p-10'>
        {categories?.length ? (
          <>
            <h1 className=' text-4xl font-bold'>Задачи</h1>
            {!days?.length && (
              <div className={styles.noDaysMessage}>
                <h3>Нет списков</h3>
                <p>
                  Вы не создали ни одного списка дня, нажмите кнопку ниже, чтобы
                  создать
                </p>
                <Button onClick={handleCreateNewDay}>Новый день</Button>
              </div>
            )}
            {!!days?.length && (
              <div className={styles.dayList}>
                <label className='text-3xl'>План на:</label>
                <Select
                  onChange={handleDayChange}
                  options={[
                    ...days.map(({ date }) => ({
                      value: date,
                      label: getFormattedDay(date),
                    })),
                  ]}
                  value={selectedDay}
                />
                <Button onClick={handleCreateNewDay}>Новый день</Button>
              </div>
            )}
            {!tasks?.length && !!days.length && (
              <div className={styles.noTasksMessage}>
                <h3>Нет задач</h3>
                <p>
                  Вы не создали ни одной задачи, нажмите кнопку ниже, чтобы
                  создать первую!
                </p>
              </div>
            )}
            <div className='grid grid-cols-2 gap-3'>
              {tasks?.map(task => (
                <Task
                  key={task.id}
                  selectedDay={selectedDay}
                  task={task}
                />
              ))}
              {!isLoading && !!days.length && (
                <CreateTaskModal
                  modeForm='CREATE'
                  selectedDay={selectedDay}
                />
              )}
              {isLoading && <Spinner />}
            </div>
            {isModalOpen && (
              <CreateDayListModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSuccess={date => setSelectedDay(date)}
              />
            )}
          </>
        ) : (
          <div className={styles.noCategoriesMessage}>
            <h3>Нет доступа к задачам</h3>
            <p>
              Вы не создали ни одной категории, чтобы получить доступ к задачам,
              создайте хотя бы одну категорию
            </p>
          </div>
        )}
      </Card>
      <CategoryBlock
        categories={categories}
        isPending={isCategoriesPending}
      />
    </>
  );
};
