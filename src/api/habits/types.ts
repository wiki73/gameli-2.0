export type Habit = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  total_xp: number; // Добавьте это
  current_streak: number; // Добавьте это
  best_streak: number; // Добавьте это
  multiplier: number; // Добавьте это
  base_xp: number; // Добавьте это
  last_completed_day: number; // Добавьте это
};

export type HabitEntry = {
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

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[];
}

export type GetManyHabitsResponse = {
  data: HabitWithEntries[];
  total: number;
  total_xp: number; // Общий XP пользователя
};

export type HabitsApiType = {
  create: (_: {
    user_id: string;
    title: string;
    description?: string;
  }) => Promise<HabitWithEntries>;

  getMany: (_: { userId: string }) => Promise<GetManyHabitsResponse>;

  getOne: (_: { id: string; userId: string }) => Promise<HabitWithEntries>;

  update: (_: {
    id: string;
    data: Partial<Habit>;
    userId: string;
  }) => Promise<void>;

  updateEntry: (_: {
    habitId: string;
    dayNumber: number;
    completed: boolean;
    userId: string;
    xpEarned?: number;
  }) => Promise<HabitEntry>;

  delete: (_: { id: string; userId: string }) => Promise<void>;
};
