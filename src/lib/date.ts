import dayjs from './dayjs';

export const getFormattedDay = (
  date: string | number | Date,
  format = 'D MMMM YYYY г.',
) => dayjs(date).locale('ru').format(format);

export const toCalendarDate = (date: Date): string =>
  getFormattedDay(date, 'YYYY-MM-DD');
