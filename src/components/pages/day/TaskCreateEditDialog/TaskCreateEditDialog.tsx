import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import z from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';
import type { Task } from '@/api/tasks/types';
import type { Day } from '@/api/days/types';
import { api } from '@/api/api';
import { useAuth } from '@/contexts/auth-context';
import { OFFLINE_MUTATIONS_TYPES } from '@/consts';
import { enqueueMutation } from '@/contexts/query-context/persist';

type Props = {
  selectedDay?: Day;
  modeForm?: 'CREATE' | 'EDIT';
  task?: Task;
};

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 50;

const taskFormSchema = z.object({
  title: z
    .string()
    .min(MIN_TITLE_LENGTH, {
      error: 'Название задачи должно содержать не менее 3 символов',
    })
    .max(MAX_TITLE_LENGTH, {
      error: 'Название задачи не должно превышать 50 символов',
    }),
  category_id: z.uuid({ error: 'Неверный формат идентификатора категории' }),
});

type TaskFormType = z.infer<typeof taskFormSchema>;

export const TaskCreateEditDialog = ({
  selectedDay,
  modeForm = 'CREATE',
  task,
}: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: task?.title ?? '',
      category_id: task?.category_id ?? '',
    },
  });

  const { control, formState, handleSubmit, setError, reset } = form;

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };
  const { data: categories, isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getMany({ userId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const createTaskMutation = useMutation<
    { offline: boolean },
    unknown,
    { title: string; category_id: string; user_id: string; day_id: string }
  >({
    mutationFn: async data => {
      if (!navigator.onLine) {
        await enqueueMutation({
          type: OFFLINE_MUTATIONS_TYPES.CREATE_TASK,
          payload: data,
        });
        return { offline: true };
      }

      await api.tasks.create(data);
      return { offline: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
        exact: false,
      });
      setOpen(false);
    },
    onError: () => {
      setError('root', {
        message: 'Ошибка при создании задачи, повторите попытку позже',
      });
    },
  });

  const updateTaskMutation = useMutation<
    { offline: boolean },
    unknown,
    { id: string; data: Partial<Task> }
  >({
    mutationFn: async ({ id, data }) => {
      if (!navigator.onLine) {
        await enqueueMutation({
          type: OFFLINE_MUTATIONS_TYPES.UPDATE_TASK,
          payload: { id, data },
        });
        return { offline: true };
      }

      await api.tasks.update({ id, data });
      return { offline: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id, selectedDay],
      });
      setOpen(false);
    },
    onError: () => {
      setError('root', {
        message: 'Ошибка при обновлении задачи, повторите попытку позже',
      });
    },
  });

  useEffect(() => {
    if (open && modeForm === 'EDIT' && task) {
      form.reset({
        title: task.title,
        category_id: task.category_id,
      });
    }
  }, [open, modeForm, task, form]);

  const isButtonDisabled = useMemo(
    () => createTaskMutation.isPending || !formState.isValid,
    [createTaskMutation.isPending, formState.isValid],
  );

  const onSubmit: SubmitHandler<TaskFormType> = ({ title, category_id }) => {
    if (!user?.id) {
      setError('root', {
        message: 'Ошибка авторизации, повторите попытку позже',
      });
      return;
    }
    if (!selectedDay) {
      setError('root', { message: 'Не выбран день для задания' });
      return;
    }

    const data = {
      title,
      category_id,
      user_id: user.id,
      day_id: selectedDay.id,
    };

    if (modeForm === 'CREATE') {
      createTaskMutation.mutate(data);
    } else if (task) {
      updateTaskMutation.mutate({
        id: task.id,
        data,
      });
    } else {
      setError('root', {
        message: 'Ошибка при обновлении задачи, повторите попытку позже',
      });
    }
  };

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={open}
    >
      <DialogTrigger asChild>
        {modeForm === 'CREATE' ? (
          <Button
            className='h-full w-full'
            disabled={!selectedDay}
            type='button'
            variant='secondary'
          >
            <PlusIcon className='size-12' />
          </Button>
        ) : (
          <Button
            disabled={!selectedDay}
            size='icon'
            type='button'
            variant='secondary'
          >
            <Pencil1Icon />
          </Button>
        )}
      </DialogTrigger>
      <Form {...form}>
        <DialogContent>
          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>
                {modeForm === 'CREATE'
                  ? 'Создание задачи'
                  : 'Редактирование задачи'}
              </DialogTitle>
              <DialogDescription>
                {modeForm === 'CREATE'
                  ? 'Введите название задачи и категорию для неё, чтобы создать новую задачу'
                  : 'Введите название задачи и категорию для неё, чтобы сохранить изменения'}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название задачи</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='title'
                      placeholder='Введите название задачи'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='category_id'
              render={({ field }) => (
                <FormItem className='max-w-full w-full'>
                  <FormLabel>Категория задачи</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className='max-w-full w-full line-clamp-1 overflow-hidden'>
                        <SelectValue placeholder='Выбери категорию' />
                      </SelectTrigger>
                      <SelectContent>
                        {isPending && <Spinner />}
                        {!isPending && !categories?.length && (
                          <p>Категории не найдены</p>
                        )}
                        {categories?.map(({ name, id }) => (
                          <SelectItem
                            key={id}
                            value={id}
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p
              className='text-destructive text-sm'
              data-slot='form-message'
            >
              {formState.errors.root?.message}
            </p>
            <DialogFooter>
              <Button
                onClick={handleClose}
                type='button'
                variant='secondary'
              >
                Отменить
              </Button>
              <Button
                disabled={isButtonDisabled}
                type='submit'
              >
                {modeForm === 'CREATE'
                  ? 'Создать задачу'
                  : 'Сохранить изменения'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
