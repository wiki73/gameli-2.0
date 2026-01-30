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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  DEFAUL_CATEGORY_RATIO,
  MAX_CATEGORY_RATIO,
  MIN_CATEGORY_RATIO,
} from '@/consts';
import { categoryFormSchema, type CategoryFormType } from '@/lib/category';
import { createCategory, updateCategory } from '@/app/actions/category';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Spinner } from '../ui/spinner';
import type { Category } from '../../../generated/prisma';

const TEXTS = {
  CREATE: {
    TITLE: 'Создание категории',
    DESCRIPTION:
      'Создайте категорию, чтобы группировать и отфильтровать ваши записи.',
    SUBMIT_BUTTON: 'Создать',
  },
  EDIT: {
    TITLE: 'Редактирование категории',
    DESCRIPTION:
      'Редактируйте параметры категории, чтобы она соответствовала вашим предпочтениям.',
    SUBMIT_BUTTON: 'Сохранить',
  },
};

type CreateProps = {
  mode?: 'CREATE';
  category?: never;
};

type EditProps = {
  mode: 'EDIT';
  category: Partial<Category>;
};

type Props = CreateProps | EditProps;

export const CategoryCreateEditDialog = ({
  mode = 'CREATE',
  category: { name, description, ratio, id } = {},
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: name ?? '',
      description: description ?? '',
      ratio: ratio ?? DEFAUL_CATEGORY_RATIO,
    },
    mode: 'onChange',
  });

  const handleSubmit: SubmitHandler<CategoryFormType> = data => {
    startTransition(async () => {
      try {
        if (mode === 'EDIT' && id) {
          await updateCategory({ id, data });
        } else {
          await createCategory({ data });
        }

        form.reset();
        setOpen(false);
        toast.success('Категория сохранена');
      } catch (e: unknown) {
        toast.error('Ошибка сохранения категории', {
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
          size={mode === 'EDIT' ? 'icon' : 'default'}
        >
          {mode === 'EDIT' && <Pencil1Icon />}
          {mode === 'CREATE' && <PlusIcon className='size-8' />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{TEXTS[mode].TITLE}</DialogTitle>
          <DialogDescription>{TEXTS[mode].DESCRIPTION}</DialogDescription>
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
                        disabled={isPending}
                        id='name'
                        placeholder='Название категории'
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
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='description'
                        disabled={isPending}
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
                        defaultValue={[DEFAUL_CATEGORY_RATIO]}
                        disabled={isPending}
                        itemType='number'
                        max={MAX_CATEGORY_RATIO}
                        min={MIN_CATEGORY_RATIO}
                        onValueChange={value => {
                          field.onChange(value?.[0]);
                        }}
                        step={1}
                        value={[field.value]}
                      />
                    </FormControl>
                    <FormLabel className='text-muted-foreground flex w-full items-start justify-between text-center'>
                      <span className='w-min text-left whitespace-pre-wrap'>
                        Очень легко
                      </span>
                      <span>Легко</span>
                      <span>Средне</span>
                      <span>Сложно</span>
                      <span className='w-min text-right whitespace-pre-wrap'>
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
                {isPending && <Spinner />}
                {TEXTS[mode].SUBMIT_BUTTON}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
