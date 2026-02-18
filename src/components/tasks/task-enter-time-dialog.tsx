'use client';

import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
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
import { taskEnterTimeSchema, type TaskEnterTimeType } from '@lib/task';
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
import { completeTimerTask } from '@/src/app/actions/task';
import { type BarData, TIME } from '@/src/consts';
import type { Task } from '@/generated/prisma';
import { ProgressBar } from '../progress-bar';

type Props = {
  task: Task;
};

const SEC_IN_HOUR = 3600;
const SEC_IN_MIN = 60;

export const TaskEnterTimeDialog = ({ task }: Props) => {
  const [open, setOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [dataForBar, setDataForBar] = useState<BarData>({
    currentExp: undefined,
    addExperience: undefined,
    level: undefined,
    categoryName: undefined,
  });

  const [isPending, startTransition] = useTransition();

  const form = useForm<TaskEnterTimeType>({
    resolver: zodResolver(taskEnterTimeSchema),
    defaultValues: {
      hours: 0,
      minutes: 0,
    },
    mode: 'onChange',
  });

  const { handleSubmit, control, reset } = form;

  const hours = useWatch({
    control,
    name: 'hours',
  });

  const onSubmit: SubmitHandler<TaskEnterTimeType> = data => {
    startTransition(async () => {
      try {
        const timeSpent = data.hours * SEC_IN_HOUR + data.minutes * SEC_IN_MIN;
        const { currentExp, addExperience, level, categoryName } =
          await completeTimerTask({ task, timeSpent });

        setDataForBar({
          currentExp: currentExp,
          addExperience: addExperience,
          level: level,
          categoryName: categoryName,
        });

        setShowProgress(true);
        toast.success('Задача завершена');
      } catch (e: unknown) {
        toast.error('Ошибка сохранения задачи', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  const handleClose = () => {
    reset();
    setShowProgress(false);
    setOpen(false);
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
            setShowProgress(false);
          }}
          size='xs'
          variant='ghost'
        >
          Внести время
        </Button>
      </DialogTrigger>

      <DialogContent>
        {!showProgress ? (
          <>
            <DialogHeader>
              <DialogTitle>Завершение задачи</DialogTitle>
              <DialogDescription>
                Сколько времени заняло выполненение задачи?
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className='flex flex-col gap-4'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='flex items-start gap-4'>
                  <FormField
                    control={form.control}
                    name='hours'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Часы</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete='hour'
                            disabled={isPending}
                            id='hours'
                            max={TIME.HOURS_IN_DAY}
                            min={0}
                            onChange={e => {
                              if (e.target.value === '') {
                                field.onChange(0);
                              } else if (
                                Number(e.target.value) >= TIME.HOURS_IN_DAY
                              ) {
                                field.onChange(TIME.HOURS_IN_DAY - 1);
                                form.setValue('minutes', 0);
                              } else {
                                field.onChange(Number(e.target.value));
                              }
                            }}
                            placeholder='0h'
                            type='number'
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage className='h-5' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='minutes'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Минуты</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete='minute'
                            disabled={isPending || hours === TIME.HOURS_IN_DAY}
                            id='minutes'
                            placeholder='0m'
                            type='number'
                            {...field}
                            max={TIME.MINUTE_IN_HOUR - 1}
                            min={0}
                            onChange={e => {
                              if (
                                e.target.value === '' ||
                                hours === TIME.HOURS_IN_DAY
                              ) {
                                field.onChange(0);
                              } else if (
                                Number(e.target.value) >= TIME.MINUTE_IN_HOUR
                              ) {
                                field.onChange(TIME.MINUTE_IN_HOUR - 1);
                              } else {
                                field.onChange(Number(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <p
                  className='text-destructive text-sm'
                  data-slot='form-message'
                >
                  {form.formState.errors.root?.message}
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
                    Внести время
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className='py-6'>
            <DialogHeader>
              <DialogTitle className='text-center'>
                Задача выполнена!
              </DialogTitle>
            </DialogHeader>

            <div className='mt-4 space-y-4'>
              {!!dataForBar.level && (
                <ProgressBar
                  addedExperience={dataForBar.addExperience}
                  categoryLevel={dataForBar.level}
                  categoryName={dataForBar.categoryName}
                  currentExperience={dataForBar.currentExp}
                />
              )}

              <p className='text-center text-sm text-green-600'>
                ✅ Получено +{dataForBar.addExperience} XP
              </p>

              <Button
                className='w-full'
                onClick={handleClose}
                type='button'
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
