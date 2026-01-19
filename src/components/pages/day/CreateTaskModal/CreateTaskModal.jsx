import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Button } from '../../../common/Button/Button';
import { Input } from '../../../common/Input/Input';
import { Modal } from '../../../common/Modal/Modal';
import { Select } from '../../../common/Select/Select';
import styles from './CreateTaskModal.module.css';

export const CreateTaskModal = ({
  isOpen,
  onClose,
  selectedDay,
  modeForm = 'CREATE',
  task,
}) => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: task?.title ?? '',
    categoryId: null,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getMany({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const createTaskMutation = useMutation({
    mutationFn: api.tasks.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      });
      onClose();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: api.tasks.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      });
      onClose();
    },
  });

  useEffect(() => {
    if (categories?.length) {
      if (modeForm === 'EDIT') {
        setFormData(prev => ({
          ...prev,
          categoryId: categories.find(cat => cat.id === task.category_id)?.id,
        }));
      } else {
        setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
      }
    }
  }, [categories, modeForm, task]);

  const isButtonDisabled = useMemo(() => {
    return (
      createTaskMutation.isLoading ||
      !formData.categoryId ||
      !formData.title ||
      formData.title.length < 3 ||
      formData.title.length > 50
    );
  }, [createTaskMutation.isLoading, formData]);

  const handleChange = field => e => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectCategory = async value => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      userId: user?.id,
      title: formData.title,
      categoryId: formData.categoryId,
      date: selectedDay,
    };

    if (modeForm === 'CREATE') {
      createTaskMutation.mutate(data);
    } else {
      updateTaskMutation.mutate({
        ...data,
        id: task.id,
      });
    }
  };

  if (!categories) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles.modal}>
        <h1 className={styles.title}>
          {modeForm === 'CREATE' ? 'Создание задачи' : 'Редактирование задачи'}
        </h1>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label className={styles.label}>Название задачи</label>
            <Input
              autoComplete='name'
              onChange={handleChange('title')}
              placeholder='Введите название задачи'
              type='text'
              value={formData.title}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Категория</label>
            <Select
              onChange={handleSelectCategory}
              options={categories.map(({ name, id }) => ({
                label: name,
                value: id,
              }))}
              value={formData.categoryId}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button
            className={styles.submit}
            disabled={isButtonDisabled}
            type='submit'
          >
            {modeForm === 'CREATE' ? 'Создать задачу' : 'Сохранить изменения'}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
