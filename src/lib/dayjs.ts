import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/ru';

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.locale('ru');

export default dayjs;
