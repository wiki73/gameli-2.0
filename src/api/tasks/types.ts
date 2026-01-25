export type Task = {
  id: string;
  title: string;
  category_id: string;
  is_done: boolean;
  user_id: string;
  day_id: string;
};

export type TaskWithDate = Task & {
  day: {
    date: Date;
  };
};

export type TaskWithCategory = Task & {
  category: {
    id: string;
    name: string;
    level: number;
    experience: number;
    ratio: number;
  };
};

export type TasksApiType = {
  create: (_: {
    user_id: string;
    title: string;
    category_id: string;
    day_id: string;
  }) => Promise<void>;
  getMany: (_: { userId: string; day_id?: string }) => Promise<TaskWithDate[]>;
  getOne: (_: { id: string }) => Promise<TaskWithCategory>;
  update: (_: { id: string; data: Partial<Task> }) => Promise<void>;
  delete: (_: { id: string }) => Promise<void>;
};
