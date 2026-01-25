import { supabase } from '../api';
import { type TasksApiType } from './types';
import type { TaskWithCategory, TaskWithDate } from './types';

export const taskApi: TasksApiType = {
  getMany: async ({ userId, day_id }) => {
    if (!userId) throw new Error('getTasks: userId is required');

    let query = supabase
      .from('tasks')
      .select(`*, day:day_lists (date)`)
      .eq('user_id', userId);

    if (day_id) {
      query = query.eq('day_id', day_id);
    }

    const { data, error } = await query.order('date', {
      referencedTable: 'day_lists',
      ascending: true,
    });

    if (error) {
      throw error;
    }

    return data as TaskWithDate[];
  },
  getOne: async ({ id }) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
      *,
      category:categories (
        id,
        name,
        level,
        experience,
        ratio
      )
    `,
      )
      .eq('id', id)
      .single<TaskWithCategory>();

    if (error) throw error;
    return data;
  },
  update: async ({ id, data }) => {
    if (!id) {
      throw new Error('updateTask: id are required');
    }

    if (Object.keys(data).length === 0) {
      throw new Error('updateTask: no fields to update');
    }

    const { error } = await supabase.from('tasks').update(data).eq('id', id);

    if (error) throw error;
  },

  delete: async ({ id }) => {
    const { error } = await supabase.from('tasks').delete().match({
      id,
    });
    if (error) throw error;
  },
  create: async ({ user_id, title, category_id, day_id }) => {
    if (!user_id || !title || !category_id || !day_id) {
      throw new Error('createTask: field is required');
    }

    const { error } = await supabase.from('tasks').insert({
      user_id,
      title,
      category_id,
      day_id,
    });

    if (error) throw error;
  },
};
