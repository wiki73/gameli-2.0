import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './CreateCategoryModal.module.css';

export const DeleteCategoryModal = ({ id, onClose, isOpen }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: api.categories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      onClose();
    },
  });

  const isButtonDisabled = useMemo(
    () => deleteMutation.isPending || !id,
    [deleteMutation.isPending, id],
  );

  const handleSubmit = e => {
    e.preventDefault();

    deleteMutation.mutate({
      id,
      userId: user?.id,
    });
  };

  return (
    <Dialog
      onOpenChange={onClose}
      open={isOpen}
    >
      <h1 className={styles.title}>
        Вы уверены что хотите удалить эту категорию?
      </h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <Button
          disabled={isButtonDisabled}
          type='submit'
          variant='destructive'
        >
          {deleteMutation.isPending ? <Spinner /> : null}
          Удалить категорию
        </Button>
      </form>
    </Dialog>
  );
};
