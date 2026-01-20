import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import classes from './CreateDayListModal.module.css';

export const CreateDayListModal = ({ isOpen, onClose, onSuccess }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createDayListMutation = useMutation({
    mutationFn: api.days.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['days', user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      onSuccess?.(date);
      onClose?.();
    },
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
    setDate('');
    setError('');
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
    <Dialog
      onOpenChange={handleClose}
      open={isOpen}
    >
      <div className={classes.modal}>
        <h2 className={classes.title}>Создать новый список дня</h2>
        <Input
          id='date'
          min={getMinDate()}
          onChange={handleDateChange}
          placeholder='Выберите дату:'
          type='date'
          value={date}
        />
        {error && <div className={classes.errorMessage}>{error}</div>}

        <div className={classes.modalActions}>
          <Button
            onClick={handleClose}
            variant='secondary'
          >
            Отмена
          </Button>
          <Button
            disabled={!date || !!error}
            onClick={handleSubmit}
          >
            Создать Дату
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
