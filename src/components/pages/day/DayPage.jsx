import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from '@radix-ui/react-icons';
import { Card } from '../../common/Card/Card';
import { useAuth } from '../../../contexts/auth-context';
import { getFormattedDay } from '../../../utils/date';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import { api } from '../../../api';
import { Select } from '../../common/Select/Select';
import { Spinner } from '../../common/spinner/Spinner';
import { Button } from '../../common/Button/Button';
import { CategoryPage } from '../category/CategoryPage';
import { CreateTaskModal } from './CreateTaskModal/CreateTaskModal';
import { CreateDayListModal } from './CreateDayListModal/CreateDayListModal';
import styles from './DayPage.module.css';
import { Task } from '@/components/entities/Task/Task';

export const DayPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dayLists, isPending: isDayListsPending } = useQuery({
    queryKey: ['day', user?.id],
    queryFn: () => api.getDayListsByUserId(user?.id),
    enabled: !!user?.id,
  });

  const {
    data: tasks,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['tasks', user?.id, selectedDay],
    queryFn: () => api.getTasks(user?.id, selectedDay ?? dayLists[0].date),
    enabled: !!user?.id && !!selectedDay,
  });

  useEffect(() => {
    if (dayLists?.length) {
      setSelectedDay(dayLists[0].date);
    }
  }, [dayLists, refetch]);

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

  if (isDayListsPending) {
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
              ...dayLists.map(({ date }) => ({
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
              className={styles.task + ' ' + styles.createButton}
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
      <CategoryPage />
    </>
  );
};
