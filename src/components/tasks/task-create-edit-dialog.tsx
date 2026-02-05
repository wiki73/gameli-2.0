'use client';

import { type SubmitHandler, useForm } from 'react-hook-form';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { taskFormSchema, type TaskFormType } from '@lib/task';
import { Button } from '@ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import type { Task } from '@/generated/prisma';
import { createTask, updateTask } from '@/src/app/actions/task';

type CreateProps = {
  mode?: 'CREATE';
  task?: never;
};

type EditProps = {
  mode: 'EDIT';
  task: Partial<Task>;
};

type Props = (CreateProps | EditProps) & {
  categoryId?: string;
  date?: Date;
};

export const TaskCreateEditDialog = ({
  mode = 'CREATE',
  task: { name, id } = {},
  categoryId,
  date,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: name ?? '',
    },
    mode: 'onBlur',
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TaskFormType> = data => {
    startTransition(async () => {
      try {
        if (mode === 'EDIT' && id) {
          await updateTask({ id, data });
        } else {
          await createTask({ data, categoryId, date });
        }

        form.reset();
        setOpen(false);
        toast.success('Задача сохранена');
      } catch (e: unknown) {
        toast.error('Ошибка сохранения задачи', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  const isButtonDisabled = useMemo(
    () => !form.formState.isValid || isPending,
    [form.formState.isValid, isPending],
  );

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant='outline'
        >
          {mode === 'CREATE' ? <PlusIcon /> : <Pencil1Icon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'CREATE' ? 'Создать' : 'Редактировать'} задачу
          </DialogTitle>
          <DialogDescription>
            {mode === 'CREATE'
              ? 'Создайте новую задачу'
              : 'Редактируйте существующую задачу'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='title'
                      disabled={isPending}
                      id='name'
                      placeholder='Название задачи'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительная информация</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='description'
                      disabled={isPending}
                      id='description'
                      placeholder='Описание задачи'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <p
              className='text-destructive text-sm'
              data-slot='form-message'
            >
              {form.formState.errors.root?.message}
            </p>
            <DialogFooter>
              <Button
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                type='button'
                variant='secondary'
              >
                Отменить
              </Button>
              <Button
                disabled={isButtonDisabled}
                type='submit'
              >
                {mode === 'CREATE' ? 'Создать задачу' : 'Сохранить изменения'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
