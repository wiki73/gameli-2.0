import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/env';
import { authApi } from './auth';
import { categoryApi } from './categories';
import { dayApi } from './days';
import { taskApi } from './tasks';
import { type ApiType } from './types';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

export const api: ApiType = {
  auth: authApi,
  categories: categoryApi,
  tasks: taskApi,
  days: dayApi,
};
