import { useEffect, useState } from 'react';
import { Modal } from '../../common/Modal/Modal';
import './CreateDayListModal.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import { useAuth } from '../../../contexts/auth-context';



export const CreateDayListModal = ({ isOpen, onClose }) => {
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    
    const createDayListMutation = useMutation({
        mutationFn: api.createDateForDayList,
        // onSuccess: () => {
        //     // Инвалидируем все запросы, связанные с day-lists
        //     queryClient.invalidateQueries({ 
        //         queryKey: ['day-lists', user?.id] 
        //     });
        //     queryClient.invalidateQueries({ 
        //         queryKey: ['day-lists-by-user', user?.id] 
        //     });
            
        //     // Закрываем модалку и очищаем поля
        //     onClose();
        //     setDate('');
        //     setError('');
        // },
        // onError: (error) => {
        //     console.error('Ошибка при создании списка:', error);
        //     setError(error.message);
        // },
    })

    const handleDateChange = (e) => {
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
        
        console.log('Выбрана дата:', date);
        
        createDayListMutation.mutate({
            date: "2020-05-05",
            userId: user?.id
        });
        onClose?.();
        setDate('');
        setError('');
    };
    
    const handleKeyDown = (e) => {
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
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className='CreateDayListModal'>
                <h2 className="modal-title">Создать новый список дня</h2>
                
                <div className="date-input-container">
                    <label htmlFor="date-input" className="date-label">
                        Выберите дату:
                    </label>
                    
                    <input
                        id="date-input"
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        onKeyDown={handleKeyDown}
                        min={getMinDate()}
                        className={`date-input ${error ? 'error' : ''}`}
                    />
                    
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}
                    
                    <div className="date-hint">
                        Выберите дату для создания нового списка задач
                    </div>
                </div>
                
                <div className="modal-actions">
                    <button
                        onClick={handleClose}
                        className="cancel-button"
                        type="button"
                    >
                        Отмена
                    </button>
                    
                    <button
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={!date || !!error}
                        type="button"
                    >
                        Создать Дату
                    </button>
                </div>
            </div>
        </Modal>
    );
};