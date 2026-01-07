import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export const getFormattedDay = (date, format = 'D MMMM YYYY г.') => {
  return dayjs(date).locale('ru').format(format);
};
