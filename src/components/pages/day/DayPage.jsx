import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Pencil1Icon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Card } from '../../common/Card/Card';
import { useAuth } from '../../../contexts/auth-context';
import { getFormattedDay } from '../../../utils/date';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import { api } from '../../../api';
import { Select } from '../../common/Select/Select';
import { Spinner } from '../../common/spinner/Spinner';
import { Button } from '../../common/Button/Button';
import { CreateTaskModal } from './CreateTaskModal/CreateTaskModal';
import { DeleteTaskModal } from './DeleteTaskModal/DeleteTaskModal';
import { CreateDayListModal } from './CreateDayListModal';
import styles from './DayPage.module.css';

export const DayPage = () => {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const { data: dayLists } = useQuery({
    queryKey: ['day', user?.id],
    queryFn: () => api.getDayListsByUserId(user?.id),
    enabled: !!user?.id,
  });

  const {
    data: tasks,
    refetch,
    isPending,
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

  const handleDayChange = async e => {
    if (e.target.value === "newDay") {
      openModal();
      console.log('zashlo')

      return
    }
    setSelectedDay(e.target.value);
  };

  const handleCreateTask = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
  };

  const handleCloseDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(false);
  };

  if (!selectedDay) {
    return <FullScreenSpinner />;
  }



  const openModal = () => {
    console.log('da')
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <Card>
      <h1>Планирование дня</h1>
      <div>
        <Select
          defaultValue={selectedDay.date}
          onClick={handleDayChange}
          options={[...dayLists.map(({ date }) => ({
            value: date,
            label: getFormattedDay(date),
          })), {value: "newDay", label:"новый день"}]}
        />
        <div className={styles.tasks}>
          {tasks?.map(task => (
            <div
              className={
                styles.task + ' ' + (task.is_done ? styles.taskCompleted : '')
              }
              key={task.id}
            >
              <h4
                className={
                  styles.taskTitle +
                  ' ' +
                  (task.is_done ? styles.taskTitleCompleted : '')
                }
              >
                {task.title}
              </h4>
              <div className={styles.taskButtons}>
                {!task.is_done && (
                  <>
                    <Button onClick={() => handleGoTask(task.id)}>
                      <PlayIcon />
                    </Button>
                    <Button variant='secondary'>
                      <Pencil1Icon />
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setIsDeleteTaskModalOpen(true)}
                  variant='danger'
                >
                  <TrashIcon />
                </Button>
              </div>
              {isDeleteTaskModalOpen && (
                <DeleteTaskModal
                  id={task.id}
                  isOpen={isDeleteTaskModalOpen}
                  onClose={handleCloseDeleteTaskModal}
                  selectedDay={selectedDay}
                />
              )}
            </div>
          ))}
          {!isPending && (
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
          {isPending && <Spinner />}
        </div>
      </div>
      {isCreateTaskModalOpen && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={handleCloseCreateTaskModal}
          selectedDay={selectedDay}
        />
      )}
      {isModalOpen && (
        <CreateDayListModal
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </Card>
  );
};
