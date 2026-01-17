import { AuthApiType } from './auth/types';
import { CategoryApiType } from './categories/types';
import { DayApiType } from './days/types';
import { TasksApiType } from './tasks/types';

export type Nullable<T> = T | null;

export type ApiType = {
  auth: AuthApiType;
  tasks: TasksApiType;
  categories: CategoryApiType;
  days: DayApiType;
};
