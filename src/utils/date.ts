import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export const getFormattedDay = (
  date: string | number | Date,
  format = 'D MMMM YYYY г.',
) => dayjs(date).locale('ru').format(format);
