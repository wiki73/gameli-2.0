import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../common/Modal/Modal';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Button } from '../../../common/Button/Button';
import styles from './DeleteTaskModal.module.css';

export const DeleteTaskModal = ({ isOpen, onClose, selectedDay, id }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      });
      onClose();
    },
  });

  const handleSubmit = async e => {
    e.preventDefault();
    deleteTaskMutation.mutate({
      id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <h1 className={styles.title}>Удалить задачу?</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <Button
          disabled={deleteTaskMutation.isLoading}
          type='submit'
          variant='danger'
        >
          Удалить
        </Button>
      </form>
    </Modal>
  );
};
