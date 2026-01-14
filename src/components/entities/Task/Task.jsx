import { useState } from 'react';
import { Pencil1Icon, PlayIcon, TrashIcon } from '@radix-ui/react-icons';
import styles from './Task.module.css';
import { Button } from '@/components/common/Button/Button';
import { DeleteTaskModal } from '@/components/pages/day/DeleteTaskModal/DeleteTaskModal';
import { CreateTaskModal } from '@/components/pages/day/CreateTaskModal/CreateTaskModal';

export const Task = ({ task, selectedDay }) => {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const handleEditTask = () => {
    setIsEditTaskModalOpen(true);
  };

  const handleDeleteTask = () => {
    setIsDeleteTaskModalOpen(true);
  };

  const handleCloseDeleteTaskModal = () => setIsDeleteTaskModalOpen(false);
  const handleCloseEditTaskModal = () => setIsEditTaskModalOpen(false);

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
        <p className={styles.taskDescription}>{task.description}description</p>
      </div>

      <div className={styles.taskButtons}>
        {!task.is_done && (
          <>
            <Button onClick={() => handleGoTask(task.id)}>
              <PlayIcon />
            </Button>
            <Button
              onClick={() => handleEditTask(task.id)}
              variant='secondary'
            >
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
      {isEditTaskModalOpen && (
        <CreateTaskModal
          isOpen={isEditTaskModalOpen}
          modeForm='EDIT'
          onClose={handleCloseEditTaskModal}
          selectedDay={selectedDay}
          task={task}
        />
      )}
    </div>
  );
};
