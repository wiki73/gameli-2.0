export type Habit = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
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
};

export type HabitWithEntries = Habit & {
  entries: HabitEntry[];
};

export type GetManyHabitsResponse = {
  data: HabitWithEntries[];
  total: number;
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
  }) => Promise<HabitEntry>;

  delete: (_: { id: string; userId: string }) => Promise<void>;
};
