import { supabase } from '../api';
import { CategoryApiType } from './types';

export const categoryApi: CategoryApiType = {
  getOne: async ({ id }) => {
    if (!id) throw new Error('getCategories: id is required');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return [];

    return data;
  },
  getMany: async ({ userId }) => {
    if (!userId) throw new Error('getCategories: userId is required');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    if (!data) return [];

    return data;
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
