import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import { Button } from '../../../common/Button/Button';
import { Input } from '../../../common/Input/Input';
import { Modal } from '../../../common/Modal/Modal';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './CreateCategoryModal.module.css';

export const CreateCategoryModal = props => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ratio: 5,
  });

  const createMutation = useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      props?.onClose();
    },
    onError: err => setError(err.message),
  });

  const isButtonDisabled = useMemo(() => {
    const formInvalid =
      formData.name.length < 3 || formData.ratio < 0 || formData.ratio > 10;

    return formInvalid || createMutation.isLoading;
  }, [formData, createMutation.isLoading]);

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);

    createMutation.mutate({
      userId: user?.id,
      name: formData.name,
      description: formData.description,
      ratio: formData.ratio,
    });
  };

  const handleChange = field => e => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal {...props}>
      <h1 className={styles.title}>Создание категории</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.containerInput}>
          <label>Категория:</label>
          <Input
            autoComplete='name'
            id='name'
            onChange={handleChange('name')}
            placeholder='Название категории'
            type='text'
            value={formData.name}
          />
        </div>

        <div className={styles.containerInput}>
          <label>Описание:</label>
          <Input
            as='textarea'
            autoComplete='description'
            id='description'
            onChange={handleChange('description')}
            placeholder='Описание категории'
            type='text'
            value={formData.description}
          />
        </div>
        <div
          className={styles.containerRangeInput}
          style={{ position: 'relative', width: '100%', marginTop: '30px' }}
        >
          <input
            id='ratio'
            max='10'
            min='0'
            onChange={handleChange('ratio')}
            style={{ width: '100%' }}
            type='range'
            value={formData.ratio}
          />
          <span
            className={styles.lableForRangeInput}
            style={{
              position: 'absolute',
              top: '-24px',
              left: `calc(${(formData.ratio / 10) * 100}% )`,
              transform: 'translateX(-50%)',
              background: '#4caf50',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {formData.ratio}
          </span>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <Button
          disabled={isButtonDisabled}
          type='submit'
        >
          {createMutation.isLoading ? <Spinner /> : null}
          Создать категорию
        </Button>
      </form>
    </Modal>
  );
};
