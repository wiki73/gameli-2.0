import { supabase } from '../api';
import type { Category, CategoryApiType } from './types';

export const categoryApi: CategoryApiType = {
  getOne: async ({ id }) => {
    if (!id) throw new Error('getCategories: id is required');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single<Category>();

    if (error) throw error;

    if (!data) throw new Error('Category not found');

    return data;
  },
  update: async ({ id, data }) => {
    if (!id) {
      throw new Error('updateCategory: id are required');
    }

    if (Object.keys(data).length === 0) {
      throw new Error('updateCategory: no fields to update');
    }

    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },
  getMany: async ({ userId, page, limit }) => {
    if (!userId) throw new Error('getCategories: userId is required');

    const query = supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (page && limit) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    if (!data) return { data: [], total: 0 };

    return {
      data: data as Category[],
      total: count ?? 0,
    };
  },

  create: async ({ userId, name, description, ratio }) => {
    if (!userId || !name || ratio === undefined) {
      throw new Error('createCategory: field is required');
    }
    const { error } = await supabase.from('categories').insert({
      user_id: userId,
      name,
      description,
      ratio,
    });

    if (error) throw error;
  },

  delete: async ({ id }) => {
    const { error } = await supabase.from('categories').delete().match({
      id,
    });

    if (error) throw error;
  },
};
