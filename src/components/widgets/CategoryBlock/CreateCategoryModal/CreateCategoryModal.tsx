import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Nullable } from '@/api/types';
import { Category } from '@/api/categories/types';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Button } from '../../../common/Button/Button';
import { Input } from '../../../common/Input/Input';
import { Modal } from '../../../common/Modal/Modal';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './CreateCategoryModal.module.pcss';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  modeForm?: 'CREATE' | 'EDIT';
  category?: Category;
};

export const CreateCategoryModal = ({
  isOpen,
  onClose,
  modeForm,
  category,
}: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Nullable<string>>(null);
  const [formData, setFormData] = useState({
    name: category?.name ?? '',
    description: category?.description ?? '',
    ratio: category?.ratio ?? 5,
  });

  useEffect(() => {
    if (modeForm === 'EDIT' && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        ratio: category.ratio || 5,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        ratio: 5,
      });
    }
  }, [modeForm, category, isOpen]);

  const createMutation = useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      onClose();
    },
    onError: err => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: api.categories.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      onClose();
    },
    onError: err => setError(err.message),
  });

  const isButtonDisabled = useMemo(() => {
    const formInvalid =
      formData.name.length < 3 || formData.ratio < 0 || formData.ratio > 10;

    return formInvalid || createMutation.isPending || updateMutation.isPending;
  }, [formData, createMutation.isPending, updateMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.id) {
      setError('Пользователь не авторизован');
      return;
    }

    const data = {
      userId: user.id,
      ...formData,
    };

    if (modeForm === 'EDIT' && category) {
      updateMutation.mutate({
        id: category.id,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setError(null);
      setFormData(prev => ({
        ...prev,
        [field]: field === 'ratio' ? parseInt(e.target.value) : e.target.value,
      }));
    };

  const modalTitle =
    modeForm === 'EDIT' ? 'Редактирование категории' : 'Создание категории';
  const buttonText =
    modeForm === 'EDIT' ? 'Сохранить изменения' : 'Создать категорию';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <h1 className={styles.title}>{modalTitle}</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <Input
          autoComplete='name'
          id='name'
          label='Название'
          onChange={handleChange('name')}
          placeholder='Название категории'
          type='text'
          value={formData.name}
        />
        <Input
          as='textarea'
          autoComplete='description'
          id='description'
          label='Описание'
          onChange={handleChange('description')}
          placeholder='Описание категории'
          type='text'
          value={formData.description}
        />
        <Input
          autoComplete='ratio'
          id='ratio'
          label='Коэффициент сложности (0-10)'
          max='10'
          min='0'
          onChange={handleChange('ratio')}
          placeholder='Коэффициент сложности (0-10)'
          type='range'
          value={formData.ratio}
        />

        {error ? <p className={styles.error}>{error}</p> : null}

        <Button
          disabled={isButtonDisabled}
          type='submit'
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <Spinner />
          ) : null}
          {buttonText}
        </Button>
      </form>
    </Modal>
  );
};
