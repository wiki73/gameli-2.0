import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Modal } from '../../../common/Modal/Modal';
import { api } from '../../../../api';
import { useAuth } from '../../../../contexts/auth-context';
import { Input } from '../../../common/Input/Input';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './CreateCategoryModal.module.css';

export const DeleteCategoryModal = ({ id, onClose, isOpen }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: api.deleteCategory,
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
        <button
          className={styles.primaryButton}
          disabled={isButtonDisabled}
          type='submit'
        >
          {deleteMutation.isLoading ? <Spinner /> : null}
          Удалить категорию
        </button>
      </form>
    </Modal>
  );
};
