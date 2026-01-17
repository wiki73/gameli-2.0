import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../../common/Modal/Modal';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Spinner } from '../../../common/spinner/Spinner';
import { Button } from '../../../common/Button/Button';
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

  const isButtonDisabled = useMemo(() => {
    return deleteMutation.isLoading || !id;
  }, [deleteMutation.isLoading, id]);

  const handleSubmit = e => {
    e.preventDefault();

    deleteMutation.mutate({
      id,
      userId: user?.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          variant='danger'
        >
          {deleteMutation.isLoading ? <Spinner /> : null}
          Удалить категорию
        </Button>
      </form>
    </Modal>
  );
};
