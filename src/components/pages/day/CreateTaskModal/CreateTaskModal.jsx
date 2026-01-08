import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '../../../common/Input/Input';
import { Modal } from '../../../common/Modal/Modal';
import { api } from '../../../../api';
import { useAuth } from '../../../../contexts/auth-context';
import { Select } from '../../../common/Select/Select';
import { Button } from '../../../common/Button/Button';
import styles from './CreateTaskModal.module.css';

export const CreateTaskModal = ({ isOpen, onClose, selectedDay }) => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: null,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(user?.id),
    enabled: !!user?.id,
  });

  const createTaskMutation = useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      }),
        onClose());
    },
  });

  useEffect(() => {
    if (categories?.length) {
      setFormData({
        categoryId: categories[0].id,
      });
    }
  }, [categories]);

  const isButtonDisabled = useMemo(() => {
    return (
      createTaskMutation.isLoading ||
      !formData.categoryId ||
      !formData.title ||
      formData.title.length < 3 ||
      formData.title.length > 50
    );
  }, [
    Mutation.isLoading, formData.categoryId, formData.title]);

  const handleChange = field => e => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    createTaskMutation.mutate({
      userId: user?.id,
      title: formData.title,
      categoryId: formData.categoryId,
      date: selectedDay,
    });
  };

  if (!categories) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      Создание задачи
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <Input
          autoComplete='name'
          onChange={handleChange('title')}
          placeholder='Название задачи'
          type='text'
          value={formData.title}
        />
        <Select
          defaultValue={categories[0]?.id ?? ''}
          onClick={handleChange('categoryId')}
          options={categories.map(({ name, id }) => ({
            label: name,
            value: id,
          }))}
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button
          disabled={isButtonDisabled}
          type='submit'
        >
          Создать
        </Button>
      </form>
    </Modal>
  );
};
