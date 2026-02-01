import { supabase } from '../api';
import { type HabitsApiType } from './types';
import type {
  GetManyHabitsResponse,
  HabitEntry,
  HabitWithEntries,
} from './types';

// Константы для расчета опыта
const BASE_XP_PER_DAY = 10; // Базовый опыт за 1 день
const DAILY_MULTIPLIER_INCREASE = 0.05; // +5% КАЖДЫЙ ДЕНЬ подряд
const MISSED_DAY_PENALTY = 0.15; // -15% при пропуске
const MAX_MULTIPLIER = 3.0; // Максимальный множитель
const MIN_MULTIPLIER = 1.0; // Минимальный множитель
const MULTIPLIER_DECIMAL_PLACES = 2; // Количество знаков после запятой для множителя

// Утилиты для расчета опыта
const calculateXpForDay = (
  habitMultiplier: number, // Текущий множитель привычки
  baseXp: number = BASE_XP_PER_DAY,
): number => {
  // XP = база × текущий множитель
  const xp = baseXp * habitMultiplier;
  return Math.round(xp);
};
const calculateNewMultiplier = (
  currentMultiplier: number, // Текущий множитель
  completed: boolean, // Выполнен ли сегодня
  lastCompletedDay: number, // Последний выполненный день
  todayDayNumber: number, // Номер сегодняшнего дня
): number => {
  let newMultiplier = currentMultiplier;

  // Проверяем, выполнен ли день ПОДРЯД
  const isConsecutive = lastCompletedDay === todayDayNumber - 1;

  if (completed) {
    if (isConsecutive) {
      // Выполнили ПОДРЯД → увеличиваем множитель
      newMultiplier = Math.min(
        currentMultiplier * (1 + DAILY_MULTIPLIER_INCREASE),
        MAX_MULTIPLIER,
      );
    }
    // Если выполнили, но НЕ подряд → множитель не меняется
  } else {
    // Не выполнили сегодня
    if (isConsecutive) {
      // Пропустили день ПОДРЯД → уменьшаем множитель
      newMultiplier = Math.max(
        currentMultiplier * (1 - MISSED_DAY_PENALTY),
        MIN_MULTIPLIER,
      );
    }
    // Если и так не подряд делали, множитель не меняется
  }

  return parseFloat(newMultiplier.toFixed(MULTIPLIER_DECIMAL_PLACES));
};

const calculateStreak = (
  entries: HabitEntry[],
): {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDay: number;
} => {
  // Получаем выполненные дни, сортируем по убыванию
  const completedEntries = entries
    .filter(entry => entry.completed)
    .sort((a, b) => b.day_number - a.day_number);

  let currentStreak = 0;
  let bestStreak = 0;
  let lastCompletedDay = 0;

  // Находим текущий стрик (последовательные дни с конца)
  if (completedEntries.length > 0 && completedEntries[0]) {
    lastCompletedDay = completedEntries[0].day_number;

    for (let i = 0; i < completedEntries.length; i++) {
      const currentEntry = completedEntries[i];
      const previousEntry = completedEntries[i - 1];

      // Проверяем, что currentEntry существует
      if (!currentEntry) continue;

      if (
        i === 0 ||
        (previousEntry &&
          currentEntry.day_number === previousEntry.day_number - 1)
      ) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Находим лучший стрик
  let tempStreak = 1;
  for (let i = 1; i < completedEntries.length; i++) {
    const currentEntry = completedEntries[i];
    const previousEntry = completedEntries[i - 1];

    // Проверяем, что оба элемента существуют
    if (!currentEntry || !previousEntry) continue;

    if (currentEntry.day_number === previousEntry.day_number - 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  return { currentStreak, bestStreak, lastCompletedDay };
};

// Типы для ответов Supabase
type SupabaseHabit = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  multiplier: number;
  base_xp: number;
  last_completed_day: number;
};

type SupabaseHabitEntry = {
  id: string;
  habit_id: string;
  user_id: string;
  day_number: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  xp_earned: number;
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
              xp_earned: 0,
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

    // Рассчитываем общий опыт пользователя
    const totalXp = habitsWithEntries.reduce(
      (sum, habit) => sum + (habit.total_xp || 0),
      0,
    );

    return {
      data: habitsWithEntries,
      total: habitsWithEntries.length,
      total_xp: totalXp,
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
        xp_earned: 0,
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
        total_xp: 0,
        current_streak: 0,
        best_streak: 0,
        multiplier: 1.0,
        base_xp: BASE_XP_PER_DAY,
        last_completed_day: 0, // Начинаем с 0
      })
      .select<string, SupabaseHabit>()
      .single();

    if (habitError) throw habitError;

    const entries = Array.from({ length: 21 }, (_, i) => ({
      habit_id: habit.id,
      day_number: i + 1,
      completed: false,
      xp_earned: 0,
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
    userId,
    xpEarned,
  }): Promise<HabitEntry> => {
    if (!habitId || dayNumber === undefined || !userId) {
      throw new Error(
        'updateHabitEntry: habitId, dayNumber and userId are required',
      );
    }

    // 1. Получаем текущую привычку
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select<string, SupabaseHabit>('*')
      .eq('id', habitId)
      .eq('user_id', userId)
      .single();

    if (habitError) throw habitError;

    // 2. Получаем все записи привычки
    const { data: allEntries, error: entriesError } = await supabase
      .from('habit_entries')
      .select<string, SupabaseHabitEntry>('*')
      .eq('habit_id', habitId)
      .order('day_number', { ascending: true });

    if (entriesError) throw entriesError;

    const entries = allEntries || [];

    // 3. Рассчитываем XP для этого дня
    const xpForDay: number =
      xpEarned !== undefined
        ? xpEarned
        : completed
          ? calculateXpForDay(habit.multiplier, habit.current_streak)
          : 0;

    // 4. Обновляем запись дня
    const { data: updatedEntry, error: updateError } = await supabase
      .from('habit_entries')
      .upsert(
        {
          habit_id: habitId,
          day_number: dayNumber,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          xp_earned: xpForDay,
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

    if (updateError) throw updateError;

    // 5. Обновляем массив записей
    const updatedEntries = entries.map(entry =>
      entry.day_number === dayNumber ? { ...entry, ...updatedEntry } : entry,
    );

    // 6. Пересчитываем статистику
    const { currentStreak, bestStreak } = calculateStreak(updatedEntries);

    // 7. Рассчитываем НОВЫЙ множитель (по новой логике)
    const newMultiplier = calculateNewMultiplier(
      habit.multiplier,
      completed,
      habit.last_completed_day,
      dayNumber,
    );

    // 8. Рассчитываем новый общий опыт
    let newTotalXp: number;
    const currentTotalXp = habit.total_xp || 0;

    if (completed) {
      // Добавили отметку → прибавляем XP
      newTotalXp = currentTotalXp + xpForDay;
    } else {
      // Сняли отметку → вычитаем XP (но не ниже 0)
      newTotalXp = Math.max(0, currentTotalXp - xpForDay);
    }

    // 9. Определяем последний выполненный день
    const newLastCompletedDay = completed
      ? dayNumber
      : habit.last_completed_day;

    // 10. Обновляем статистику привычки
    const { error: habitUpdateError } = await supabase
      .from('habits')
      .update({
        total_xp: newTotalXp,
        current_streak: currentStreak,
        best_streak: Math.max(habit.best_streak || 0, bestStreak),
        multiplier: newMultiplier,
        last_completed_day: newLastCompletedDay,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .eq('user_id', userId);

    if (habitUpdateError) throw habitUpdateError;

    return updatedEntry as HabitEntry;
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
