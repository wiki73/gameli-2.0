import { supabase } from '../api';
import { DayApiType } from './types';

export const dayApi: DayApiType = {
  getMany: async ({ userId }) => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('day_lists')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return data;
  },

  create: async ({ userId, date }) => {
    if (!userId || !date) {
      throw new Error('createDayList: userId and date are required');
    }

    const { data: existingList, error: checkError } = await supabase
      .from('day_lists')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingList) {
      throw new Error('Список на эту дату уже существует');
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
