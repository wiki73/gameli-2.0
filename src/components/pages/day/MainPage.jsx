import { PlusIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Task } from '@/components/entities/Task/Task';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { getFormattedDay } from '../../../utils/date';
import { Button } from '../../common/Button/Button';
import { Card } from '../../common/Card/Card';
import { Select } from '../../common/Select/Select';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import { Spinner } from '../../common/spinner/Spinner';
import { CategoryBlock } from '../../widgets/CategoryBlock/CategoryBlock';
import { CreateDayListModal } from './CreateDayListModal/CreateDayListModal';
import { CreateTaskModal } from './CreateTaskModal/CreateTaskModal';
import styles from './MainPage.module.css';

export const MainPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: days, isPending: isDaysPending } = useQuery({
    queryKey: ['days', user?.id],
    queryFn: () => api.days.getMany({ userId: user?.id }),
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

  const handleCreateTask = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    setIsEditTaskModalOpen(false);
  };

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
      <Card className={styles.tasksBlock}>
        <h1>Задачи</h1>
        <div className={styles.dayList}>
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
          <Button
            onClick={handleCreateNewDay}
            size='md'
          >
            Новый день
          </Button>
        </div>
        <div className={styles.tasks}>
          {tasks?.map(task => (
            <Task
              key={task.id}
              selectedDay={selectedDay}
              task={task}
            />
          ))}
          {!isLoading && (
            <Button
              onClick={handleCreateTask}
              type='button'
              variant='secondary'
            >
              <PlusIcon
                height={32}
                width={32}
              />
            </Button>
          )}
          {isLoading && <Spinner />}
        </div>
        {isCreateTaskModalOpen && (
          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            modeForm='CREATE'
            onClose={handleCloseCreateTaskModal}
            selectedDay={selectedDay}
          />
        )}
        {isModalOpen && (
          <CreateDayListModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={date => setSelectedDay(date)}
          />
        )}
      </Card>
      <CategoryBlock />
    </>
  );
};
