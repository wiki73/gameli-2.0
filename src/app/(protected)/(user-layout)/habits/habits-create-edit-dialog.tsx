'use client';
import { useEffect, useState } from 'react';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { type SubmitHandler, useForm } from 'react-hook-form';
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
import {
  DESCRIPTION_MAX_LENGTH,
  habitFormSchema,
  type HabitFormType,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@/src/lib/habit';
import type { Habit } from '@/generated/prisma';
import { createHabit, updateHabit } from '@/src/app/actions/habits';

type Props = {
  modeForm?: 'CREATE' | 'EDIT';
  habit?: Habit;
  children?: React.ReactNode;
  userId: string;
};

export const HabitCreateEditDialog = ({
  modeForm = 'CREATE',
  habit,
  children,
  userId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HabitFormType>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: habit?.title ?? '',
      description: habit?.description ?? '',
    },
  });

  useEffect(() => {
    if (isOpen && habit) {
      form.reset({
        title: habit.title,
        description: habit.description ?? '',
      });
    }
  }, [isOpen, habit, form]);

  const { setError } = form;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const handleSubmit: SubmitHandler<HabitFormType> = async data => {
    setIsLoading(true);
    try {
      if (modeForm === 'EDIT' && habit) {
        if (!userId) {
          setError('root', { message: 'Пользователь не авторизован' });
          return;
        }

        await updateHabit({
          id: habit.id,
          data,
        }); // вот тут самый смак

        setIsOpen(false);
        form.reset();
      } else {
        if (!userId) {
          setError('root', { message: 'Пользователь не авторизован' });
          return;
        }

        await createHabit({ data }); // всторо самый смак
        setIsOpen(false);
        form.reset();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка';
      setError('root', {
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
            className={modeForm === 'CREATE' ? 'h-full' : ''}
            onClick={() => {
              setIsOpen(true);
            }}
            size={modeForm === 'CREATE' ? 'default' : 'icon'}
            variant={modeForm === 'CREATE' ? 'default' : 'secondary'}
          >
            {modeForm === 'CREATE' ? (
              <>
                <PlusIcon className='size-3 md:size-8' />
                <p className=' text-sm md:text-xl'>Новая привычка</p>
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                disabled={!form.formState.isValid || isLoading}
                type='submit'
              >
                {isLoading ? 'Сохранение...' : buttonText}
              </Button>

              {form.formState.errors.root && (
                <div className='text-destructive bg-destructive/10 rounded p-2 text-center text-sm'>
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
