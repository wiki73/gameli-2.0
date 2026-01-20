import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
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
    <Dialog
      onOpenChange={onClose}
      open={isOpen}
    >
      <h1 className={styles.title}>Удалить задачу?</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <Button
          disabled={deleteTaskMutation.isPending}
          type='submit'
          variant='destructive'
        >
          Удалить
        </Button>
      </form>
    </Dialog>
  );
};
