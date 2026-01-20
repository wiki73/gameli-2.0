import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/api/tasks/types';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';
import styles from './CreateTaskModal.module.css';

type Props = {
  selectedDay: string;
  modeForm?: 'CREATE' | 'EDIT';
  task?: Task;
};

export const CreateTaskModal = ({
  selectedDay,
  modeForm = 'CREATE',
  task,
}: Props) => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: api.tasks.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      });
      setIsOpen(false);
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

  const isButtonDisabled = useMemo(
    () =>
      createTaskMutation.isPending ||
      !formData.categoryId ||
      !formData.title ||
      formData.title.length < 3 ||
      formData.title.length > 50,
    [createTaskMutation.isPending, formData],
  );

  const handleChange = field => e => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // const handleSelectCategory = async value => {
  //   setFormData(prev => ({ ...prev, categoryId: value }));
  // };

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
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          className='h-full'
          onClick={() => setIsOpen(true)}
          type='button'
          variant='secondary'
        >
          <PlusIcon
            height={32}
            width={32}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              onValueChange={value =>
                setFormData(prev => ({ ...prev, categoryId: value }))
              }
              value={formData.categoryId ?? ''}
            >
              <SelectTrigger>
                <SelectValue placeholder='Выбери категорию' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Категории</SelectLabel>
                  {categories.map(({ name, id }) => (
                    <SelectItem
                      key={id}
                      value={id}
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
      </DialogContent>
    </Dialog>
  );
};
