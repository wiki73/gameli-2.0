'use client';

import { type SubmitHandler, useForm } from 'react-hook-form';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState, useTransition } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import type { Task } from '@/generated/prisma';
import { createTask, updateTask } from '@/src/app/actions/task';
import { getUserCategories } from '@/src/app/actions/category';

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
  task: { name, id, description, categoryId } = {},
  categoryId: defaultCategoryId,
  date,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<
    { id: string; name: string; description: string | null; ratio: number }[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: name ?? '',
      description: description ?? '',
      categoryId: categoryId ?? defaultCategoryId ?? '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) {
      setIsLoadingCategories(true);
      getUserCategories()
        .then(setCategories)
        .catch(() => toast.error('Не удалось загрузить категории'))
        .finally(() => {
          setIsLoadingCategories(false);
        });
    }
  }, [open]);

  const { handleSubmit } = form;
  const onSubmit: SubmitHandler<TaskFormType> = data => {
    startTransition(async () => {
      try {
        if (mode === 'EDIT' && id) {
          await updateTask({ id, data });
        } else {
          await createTask({ data, categoryId: data.categoryId, date });
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

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Выберите категорию (необязательно)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCategories && (
                        <div className='flex items-center justify-center p-2'>
                          <span className='text-sm text-gray-500'>
                            Загрузка...
                          </span>
                        </div>
                      )}
                      {!isLoadingCategories && categories.length === 0 && (
                        <div className='p-2 text-sm text-gray-500'>
                          Категории не найдены
                        </div>
                      )}
                      {!isLoadingCategories &&
                        categories.map(category => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
