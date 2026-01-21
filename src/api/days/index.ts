import { supabase } from '../api';
import { DayApiType } from './types';

export const dayApi: DayApiType = {
  getMany: async ({ userId }) => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('day_lists')
      .select(`*,tasks(count)`)
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    return data;
  },

  create: async ({ userId, date }) => {
    if (!userId || !date) {
      throw new Error('createDayList: userId and date are required');
    }

    const { error } = await supabase
      .from('day_lists')
      .insert({
        user_id: userId,
        date,
      })
      .select()
      .single();

    if (error) throw error;
  },
};
