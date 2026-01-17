import { createClient } from '@supabase/supabase-js';
import { ApiType } from './types';
import { authApi } from './auth';
import { taskApi } from './tasks';
import { categoryApi } from './categories';
import { dayApi } from './days';
import { supabaseConfig } from '@/config/env';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

export const api: ApiType = {
  auth: authApi,
  categories: categoryApi,
  tasks: taskApi,
  days: dayApi,
};
