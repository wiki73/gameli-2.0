import { supabase } from '../api';
import { Task, TasksApiType } from './types';

export const taskApi: TasksApiType = {
  getMany: async ({ userId, date }) => {
    if (!userId) throw new Error('getTasks: userId is required');

    let query = supabase.from('tasks').select('*').eq('user_id', userId);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  },
  getOne: async ({ id }) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
  update: async ({ id, userId, title, categoryId, date }) => {
    if (!id || !userId) {
      throw new Error('updateTask: id and userId are required');
    }

    const updates: Partial<Task> = {};

    if (title) updates.title = title;
    if (categoryId) updates.category_id = categoryId;
    if (date) updates.date = date;

    if (Object.keys(updates).length === 0) {
      throw new Error('updateTask: no fields to update');
    }

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  delete: async ({ id }) => {
    const { error } = await supabase.from('tasks').delete().match({
      id,
    });
    if (error) throw error;
  },
  create: async ({ userId, title, categoryId, date }) => {
    if (!userId || !title || !categoryId || !date) {
      throw new Error('createTask: field is required');
    }

    const { error } = await supabase.from('tasks').insert({
      user_id: userId,
      title,
      category_id: categoryId,
      date,
    });

    if (error) throw error;
  },
};
