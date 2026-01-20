import { Pencil1Icon, PlayIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreateTaskModal } from '@/components/pages/day/CreateTaskModal/CreateTaskModal';
import { DeleteTaskModal } from '@/components/pages/day/DeleteTaskModal/DeleteTaskModal';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import styles from './Task.module.css';

export const Task = ({ task, selectedDay }) => {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditTask = () => {
    setIsEditTaskModalOpen(true);
  };

  const handleCloseDeleteTaskModal = () => setIsDeleteTaskModalOpen(false);

  const handleGoTask = () => {
    navigate(`${ROUTES.TASK}`.replace(':taskId', `${task.id}`));
  };
  return (
    <div
      className={styles.task + ' ' + (task.is_done ? styles.taskCompleted : '')}
      key={task.id}
    >
      <div className={styles.taskContent}>
        <h4
          className={
            styles.taskTitle +
            ' ' +
            (task.is_done ? styles.taskTitleCompleted : '')
          }
        >
          {task.title}
        </h4>
      </div>

      <div className={styles.taskButtons}>
        {!task.is_done && (
          <>
            <Button
              onClick={handleGoTask}
              size='icon'
            >
              <PlayIcon />
            </Button>
            <Button
              onClick={() => handleEditTask()}
              size='icon'
              variant='secondary'
            >
              <Pencil1Icon />
            </Button>
          </>
        )}
        <Button
          onClick={() => setIsDeleteTaskModalOpen(true)}
          size='icon'
          variant='destructive'
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
      {isEditTaskModalOpen && (
        <CreateTaskModal
          modeForm='EDIT'
          selectedDay={selectedDay}
          task={task}
        />
      )}
    </div>
  );
};
