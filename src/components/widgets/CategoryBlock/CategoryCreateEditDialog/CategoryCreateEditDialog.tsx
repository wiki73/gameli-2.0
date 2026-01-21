import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Category } from '@/api/categories/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';

type Props = {
  modeForm?: 'CREATE' | 'EDIT';
  category?: Category;
};

type CategoryForm = {
  name: string;
  description: string;
  ratio: number;
};

export const CategoryCreateEditDialog = ({
  modeForm = 'CREATE',
  category,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<CategoryForm>({
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
      ratio: category?.ratio ?? 3,
    },
  });

  const { setError } = form;

  const createMutation = useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      setIsOpen(false);
    },
    onError: err => setError('root', { message: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: api.categories.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      setIsOpen(false);
    },
    onError: err => setError('root', { message: err.message }),
  });

  const isButtonDisabled = useMemo(
    () =>
      !form.formState.isValid ||
      createMutation.isPending ||
      updateMutation.isPending,
    [
      createMutation.isPending,
      form.formState.isValid,
      updateMutation.isPending,
    ],
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const handleSubmit: SubmitHandler<CategoryForm> = data => {
    if (modeForm === 'EDIT' && category) {
      updateMutation.mutate({
        id: category.id,
        data,
      });
    } else {
      createMutation.mutate({
        userId: user?.id ?? '',
        ...data,
      });
    }
  };

  const modalTitle =
    modeForm === 'EDIT' ? 'Редактирование категории' : 'Создание категории';
  const modalDescription =
    modeForm === 'EDIT'
      ? 'Введите новые данные, чтобы отредактировать категорию'
      : 'Введите название категории и коэффициент сложности, чтобы создать новую категорию';
  const buttonText =
    modeForm === 'EDIT' ? 'Сохранить изменения' : 'Создать категорию';

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          className={cn(modeForm === 'CREATE' && 'h-full')}
          onClick={() => setIsOpen(true)}
          variant='secondary'
        >
          {modeForm === 'CREATE' ? (
            <PlusIcon className='size-12' />
          ) : (
            <Pencil1Icon />
          )}
        </Button>
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='title'
                      id='name'
                      placeholder='Название категории'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='description'
                      id='description'
                      placeholder='Описание категории'
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
              name='ratio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Коэффициент сложности</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[3]}
                      max={5}
                      min={1}
                      onChange={e => [field.onChange(e)]}
                      step={1}
                    />
                  </FormControl>
                  <FormLabel className='flex w-full justify-between items-start text-center text-muted-foreground'>
                    <span className='whitespace-pre-wrap w-min text-left'>
                      Очень легко
                    </span>
                    <span>Легко</span>
                    <span>Средне</span>
                    <span>Сложно</span>
                    <span className='whitespace-pre-wrap w-min text-right'>
                      Очень сложно
                    </span>
                  </FormLabel>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isButtonDisabled}
              type='submit'
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Spinner />
              )}
              {buttonText}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
