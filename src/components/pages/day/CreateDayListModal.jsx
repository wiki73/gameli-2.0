import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../common/Modal/Modal';
import './CreateDayListModal.css';
import { api } from '../../../api';
import { useAuth } from '../../../contexts/auth-context';

export const CreateDayListModal = ({ isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const createDayListMutation = useMutation({
    mutationFn: api.createDateForDayList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['day', user?.id],
      });
      пшеqueryClient.invalidateQueries({ queryKey: ['tasks'] });
    },

    //     // Закрываем модалку и очищаем поля
    //     onClose();
    //     setDate('');
    //     setError('');
    // },
    // onError: (error) => {
    //     console.error('Ошибка при создании списка:', error);
    //     setError(error.message);
    // },
  });

  const handleDateChange = e => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!date) {
      setError('Пожалуйста, выберите дату');
      return;
    }

    if (error) {
      return;
    }

    createDayListMutation.mutate({
      date: date,
      userId: user?.id,
    });
    onClose?.();
    setDate('');
    setError('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleClose = () => {
    setDate('');
    setError('');
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className='CreateDayListModal'>
        <h2 className='modal-title'>Создать новый список дня</h2>

        <div className='date-input-container'>
          <label
            className='date-label'
            htmlFor='date-input'
          >
            Выберите дату:
          </label>

          <input
            className={`date-input ${error ? 'error' : ''}`}
            id='date-input'
            min={getMinDate()}
            onChange={handleDateChange}
            onKeyDown={handleKeyDown}
            type='date'
            value={date}
          />

          {error && (
            <div className='error-message'>
              <span className='error-icon'>!</span>
              {error}
            </div>
          )}

          <div className='date-hint'>
            Выберите дату для создания нового списка задач
          </div>
        </div>

        <div className='modal-actions'>
          <button
            className='cancel-button'
            onClick={handleClose}
            type='button'
          >
            Отмена
          </button>

          <button
            className='submit-button'
            disabled={!date || !!error}
            onClick={handleSubmit}
            type='button'
          >
            Создать Дату
          </button>
        </div>
      </div>
    </Modal>
  );
};
