'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import {completeTimerTaskForEnter } from '@/src/app/actions/task';
import { TIME } from '@/src/consts';
import type { Task } from '@/generated/prisma';
import { ProgressBar } from '../progress-bar';

type Props = { task: Task };

const SEC_IN_HOUR = 3600;
const SEC_IN_MIN = 60;
const INTERVAL =200

export const TaskEnterTimeDialog = ({ task }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'form' | 'success'>('form');
  const [result, setResult] = useState<{
    currentExp?: number;
    addExperience?: number;
    level?: number;
    categoryName?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  const form = useForm<TaskEnterTimeType>({
    resolver: zodResolver(taskEnterTimeSchema),
    defaultValues: { hours: 0, minutes: 0 },
    mode: 'onChange',
  });

  const hours = form.watch('hours');

  const onSubmit = (data: TaskEnterTimeType) => {
    startTransition(async () => {
      try {
        const timeSpent = data.hours * SEC_IN_HOUR + data.minutes * SEC_IN_MIN;
        const res = await completeTimerTaskForEnter({ task, timeSpent });
        setResult(res);
        setMode('success');
        toast.success('Задача завершена');
      } catch (e) {
        toast.error('Ошибка', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setMode('form');
      form.reset();
      setResult({});
    }, INTERVAL);
  };

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          onClick={e => {
            e.stopPropagation(); // предотвращаем закрытие dropdown
            setOpen(true);
          }}
          size='xs'
          variant='ghost'
        >
          Внести время
        </Button>
      </DialogTrigger>
      <DialogContent>
        {mode === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Завершение задачи</DialogTitle>
              <DialogDescription>
                Сколько времени заняло выполнение задачи?
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className='space-y-4'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className='flex gap-4'>
                  <FormField
                    control={form.control}
                    name='hours'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Часы</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            max={TIME.HOURS_IN_DAY}
                            min={0}
                            placeholder='0'
                            type='number'
                            {...field}
                            onChange={e => {
                              const val =
                                e.target.value === ''
                                  ? 0
                                  : Number(e.target.value);
                              if (val >= TIME.HOURS_IN_DAY) {
                                field.onChange(TIME.HOURS_IN_DAY - 1);
                                form.setValue('minutes', 0);
                              } else {
                                field.onChange(val);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
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
                            disabled={isPending || hours === TIME.HOURS_IN_DAY}
                            max={TIME.MINUTE_IN_HOUR - 1}
                            min={0}
                            placeholder='0'
                            type='number'
                            {...field}
                            onChange={e => {
                              if (hours === TIME.HOURS_IN_DAY) {
                                field.onChange(0);
                                return;
                              }
                              const val =
                                e.target.value === ''
                                  ? 0
                                  : Number(e.target.value);
                              if (val >= TIME.MINUTE_IN_HOUR) {
                                field.onChange(TIME.MINUTE_IN_HOUR - 1);
                              } else {
                                field.onChange(val);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleClose}
                    type='button'
                    variant='secondary'
                  >
                    Отмена
                  </Button>
                  <Button
                    disabled={!form.formState.isValid || isPending}
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
              {result.level != null && (
                <ProgressBar
                  addedExperience={result.addExperience}
                  categoryLevel={result.level}
                  categoryName={result.categoryName}
                  currentExperience={result.currentExp}
                />
              )}
              <p className='text-center text-sm text-green-600'>
                ✅ Получено +{result.addExperience} XP
              </p>
              <Button
                className='w-full'
                onClick={handleClose}
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
