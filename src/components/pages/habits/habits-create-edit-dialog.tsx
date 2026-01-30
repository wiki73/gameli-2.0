import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Input } from '@ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Spinner } from '@ui/spinner';
import type { Habit } from '@/api/habits/types';
import { cn } from '@/lib/utils';
import { habitApi } from '@/api/habits';
import { useAuth } from '@/contexts/auth';

type Props = {
  modeForm?: 'CREATE' | 'EDIT';
  habit?: Habit;
  children?: React.ReactNode;
};

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 200;

const habitFormSchema = z.object({
  title: z
    .string()
    .min(
      TITLE_MIN_LENGTH,
      `Название должно содержать не менее ${String(TITLE_MIN_LENGTH)} символов`,
    )
    .max(
      TITLE_MAX_LENGTH,
      `Название должно содержать не более ${String(TITLE_MAX_LENGTH)} символов`,
    ),
  description: z
    .string()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Описание должно содержать не более ${String(DESCRIPTION_MAX_LENGTH)} символов`,
    )
    .optional(),
});

type HabitFormType = z.infer<typeof habitFormSchema>;

export const HabitCreateEditDialog = ({
  modeForm = 'CREATE',
  habit,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<HabitFormType>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: habit?.title ?? '',
      description: habit?.description ?? '', // Преобразуем null в пустую строку
    },
  });

  useEffect(() => {
    if (isOpen && habit) {
      form.reset({
        title: habit.title,
        description: habit.description ?? '', // Преобразуем null в пустую строку
      });
    }
  }, [isOpen, habit, form]);

  const { setError } = form;

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      if (!user?.id) throw new Error('Пользователь не авторизован');
      return habitApi.create({
        user_id: user.id,
        title: data.title,
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['habits', user?.id],
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (err: Error) => {
      setError('root', {
        message: err.message || 'Не удалось создать привычку',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description?: string;
    }) => {
      if (!user?.id) throw new Error('Пользователь не авторизован');

      return habitApi.update({
        id: data.id,
        userId: user.id,
        data: {
          title: data.title,
          description: data.description ?? '',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['habits', user?.id],
      });
      setIsOpen(false);
    },
    onError: (err: Error) => {
      setError('root', {
        message: err.message || 'Не удалось обновить привычку',
      });
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const handleSubmit: SubmitHandler<HabitFormType> = data => {
    if (modeForm === 'EDIT' && habit) {
      if (!user?.id) {
        setError('root', { message: 'Пользователь не авторизован' });
        return;
      }

      updateMutation.mutate({
        id: habit.id,
        title: data.title,
        description: data.description || undefined, // Пустая строка -> undefined
      });
    } else {
      if (!user?.id) {
        setError('root', { message: 'Пользователь не авторизован' });
        return;
      }

      createMutation.mutate({
        title: data.title,
        description: data.description || undefined, // Пустая строка -> undefined
      });
    }
  };

  const modalTitle =
    modeForm === 'EDIT' ? 'Редактирование привычки' : 'Создание привычки';
  const modalDescription =
    modeForm === 'EDIT'
      ? 'Введите новые данные, чтобы отредактировать привычку'
      : 'Введите название привычки, чтобы создать новую привычку';
  const buttonText =
    modeForm === 'EDIT' ? 'Сохранить изменения' : 'Создать привычку';

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <DialogTrigger asChild>
        {children || (
          <Button
            className={cn(modeForm === 'CREATE' && 'h-full')}
            onClick={() => {
              setIsOpen(true);
            }}
            size={modeForm === 'CREATE' ? 'default' : 'icon'}
            variant={modeForm === 'CREATE' ? 'default' : 'secondary'}
          >
            {modeForm === 'CREATE' ? (
              <>
                <PlusIcon className='size-12' />
                Новая привычка
              </>
            ) : (
              <Pencil1Icon />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-4'
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit(handleSubmit)();
            }}
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='title'
                      disabled={isPending}
                      id='title'
                      placeholder='Например: Зарядка утром'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Минимум {TITLE_MIN_LENGTH} символа, максимум{' '}
                    {TITLE_MAX_LENGTH} символов
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание (необязательно)</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='description'
                      disabled={isPending}
                      id='description'
                      placeholder='Опишите вашу привычку...'
                      type='text'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Максимум {DESCRIPTION_MAX_LENGTH} символов
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-2'>
              <Button
                disabled={!form.formState.isValid || isPending}
                type='submit'
              >
                {isPending && <Spinner />}
                {buttonText}
              </Button>

              {form.formState.errors.root && (
                <div className='text-sm text-destructive text-center p-2 bg-destructive/10 rounded'>
                  {form.formState.errors.root.message}
                </div>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
