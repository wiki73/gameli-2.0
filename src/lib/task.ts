import z from 'zod';
import type { Task } from '@/generated/prisma';
import { TIME } from '../consts';
import dayjs from './dayjs';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 500;

export const taskFormSchema = z.object({
  name: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      `Название должно содержать не менее ${String(MIN_NAME_LENGTH)} символов`,
    )
    .max(
      MAX_NAME_LENGTH,
      `Название должно содержать не более ${String(MAX_NAME_LENGTH)} символов`,
    ),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Описание должно содержать не более ${String(MAX_DESCRIPTION_LENGTH)} символов`,
    )
    .optional(),
});

export type TaskFormType = z.infer<typeof taskFormSchema>;

export const groupTasksByWeekday = (tasks: Task[]) =>
  tasks.reduce<Record<number, Task[]>>((acc, task) => {
    const day = dayjs(task.date).isoWeekday();
    acc[day] ??= [];
    acc[day].push(task);
    return acc;
  }, {});

export const taskEnterTimeSchema = z.object({
  hours: z
    .number()
    .min(0, {
      error: 'Неверное количество часов',
    })
    .max(TIME.HOURS_IN_DAY - 1, {
      error: 'Неверное количество часов',
    }),
  minutes: z
    .number()
    .min(0, {
      error: 'Неверное количество минут',
    })
    .max(TIME.MINUTE_IN_HOUR - 1, {
      error: 'Неверное количество минут',
    }),
});

export type TaskEnterTimeType = z.infer<typeof taskEnterTimeSchema>;
