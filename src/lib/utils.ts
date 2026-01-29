import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFormattedDay = (
  date: string | number | Date,
  format = 'D MMMM YYYY г.',
) => dayjs(date).locale('ru').format(format);

export const toCalendarDate = (date: Date): string =>
  getFormattedDay(date, 'YYYY-MM-DD');
