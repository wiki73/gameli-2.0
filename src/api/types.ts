import type { DayApiType } from './days/types';
import type { TasksApiType } from './tasks/types';
import type { AuthApiType } from './auth/types';
import type { CategoryApiType } from './categories/types';

export type Nullable<T> = T | undefined | null;

export type ApiType = {
  auth: AuthApiType;
  tasks: TasksApiType;
  categories: CategoryApiType;
  days: DayApiType;
};
