import { supabase } from '../api';
import { type HabitsApiType } from './types';
import type {
  GetManyHabitsResponse,
  HabitEntry,
  HabitWithEntries,
} from './types';

// Типы для ответов Supabase
type SupabaseHabit = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type SupabaseHabitEntry = {
  id: string;
  habit_id: string;
  day_number: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export const habitApi: HabitsApiType = {
  getMany: async ({ userId }): Promise<GetManyHabitsResponse> => {
    if (!userId) throw new Error('getHabits: userId is required');

    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select<string, SupabaseHabit>('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (habitsError) throw habitsError;

    const habitsWithEntries = await Promise.all(
      (habits || []).map(
        async (habit: SupabaseHabit): Promise<HabitWithEntries> => {
          const { data: entries, error: entriesError } = await supabase
            .from('habit_entries')
            .select<string, SupabaseHabitEntry>('*')
            .eq('habit_id', habit.id)
            .order('day_number', { ascending: true });

          if (entriesError) throw entriesError;

          if (!entries || entries.length === 0) {
            const defaultEntries = Array.from({ length: 21 }, (_, i) => ({
              habit_id: habit.id,
              day_number: i + 1,
              completed: false,
            }));

            const { error: insertError } = await supabase
              .from('habit_entries')
              .upsert(defaultEntries, {
                onConflict: 'habit_id,day_number',
                ignoreDuplicates: false,
              });

            if (insertError) throw insertError;

            const { data: newEntries, error: newEntriesError } = await supabase
              .from('habit_entries')
              .select<string, SupabaseHabitEntry>('*')
              .eq('habit_id', habit.id)
              .order('day_number', { ascending: true });

            if (newEntriesError) throw newEntriesError;

            const typedNewEntries = (newEntries || []) as HabitEntry[];
            return {
              ...habit,
              entries: typedNewEntries,
            };
          }

          const typedEntries = (entries || []) as HabitEntry[];
          return {
            ...habit,
            entries: typedEntries,
          };
        },
      ),
    );

    return {
      data: habitsWithEntries,
      total: habitsWithEntries.length,
    };
  },

  getOne: async ({ id, userId }): Promise<HabitWithEntries> => {
    if (!id || !userId) throw new Error('getHabit: id and userId are required');

    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select<string, SupabaseHabit>('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (habitError) throw habitError;

    const { data: entries, error: entriesError } = await supabase
      .from('habit_entries')
      .select<string, SupabaseHabitEntry>('*')
      .eq('habit_id', id)
      .order('day_number', { ascending: true });

    if (entriesError) throw entriesError;

    if (!entries || entries.length === 0) {
      const defaultEntries = Array.from({ length: 21 }, (_, i) => ({
        habit_id: id,
        day_number: i + 1,
        completed: false,
      }));

      const { error: insertError } = await supabase
        .from('habit_entries')
        .upsert(defaultEntries, {
          onConflict: 'habit_id,day_number',
          ignoreDuplicates: false,
        });

      if (insertError) throw insertError;

      const { data: newEntries, error: newEntriesError } = await supabase
        .from('habit_entries')
        .select<string, SupabaseHabitEntry>('*')
        .eq('habit_id', id)
        .order('day_number', { ascending: true });

      if (newEntriesError) throw newEntriesError;

      const typedNewEntries = (newEntries || []) as HabitEntry[];
      return {
        ...habit,
        entries: typedNewEntries,
      };
    }

    const typedEntries = (entries || []) as HabitEntry[];
    return {
      ...habit,
      entries: typedEntries,
    };
  },

  create: async ({
    user_id,
    title,
    description,
  }): Promise<HabitWithEntries> => {
    if (!user_id || !title) {
      throw new Error('createHabit: user_id and title are required');
    }

    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .insert({
        user_id,
        title,
        description: description || null,
      })
      .select<string, SupabaseHabit>()
      .single();

    if (habitError) throw habitError;

    const entries = Array.from({ length: 21 }, (_, i) => ({
      habit_id: habit.id,
      day_number: i + 1,
      completed: false,
    }));

    const { error: entriesError } = await supabase
      .from('habit_entries')
      .upsert(entries, {
        onConflict: 'habit_id,day_number',
        ignoreDuplicates: false,
      });

    if (entriesError) throw entriesError;

    const { data: habitWithEntries, error } = await supabase
      .from('habits')
      .select<string, HabitWithEntries>(
        `
                *,
                entries:habit_entries(*)
            `,
      )
      .eq('id', habit.id)
      .single();

    if (error) throw error;

    return habitWithEntries;
  },

  update: async ({ id, data, userId }): Promise<void> => {
    if (!id || !userId) {
      throw new Error('updateHabit: id and userId are required');
    }

    if (Object.keys(data).length === 0) {
      throw new Error('updateHabit: no fields to update');
    }

    const { error } = await supabase
      .from('habits')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  updateEntry: async ({
    habitId,
    dayNumber,
    completed,
  }): Promise<HabitEntry> => {
    if (!habitId || dayNumber === undefined) {
      throw new Error('updateHabitEntry: habitId and dayNumber are required');
    }

    const { data, error } = await supabase
      .from('habit_entries')
      .upsert(
        {
          habit_id: habitId,
          day_number: dayNumber,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'habit_id,day_number',
        },
      )
      .eq('habit_id', habitId)
      .eq('day_number', dayNumber)
      .select<string, SupabaseHabitEntry>()
      .single();

    if (error) throw error;

    return data as HabitEntry;
  },

  delete: async ({ id, userId }): Promise<void> => {
    if (!id || !userId)
      throw new Error('deleteHabit: id and userId are required');

    const { error: entriesError } = await supabase
      .from('habit_entries')
      .delete()
      .eq('habit_id', id);

    if (entriesError) throw entriesError;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
