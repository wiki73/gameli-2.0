export type Task = {
  id: string;
  title: string;
  category_id: string;
  is_done: boolean;
  user_id: string;
  day_id: string;
  day?: {
    date?: Date;
  };
};

export type TasksApiType = {
  create: (_: {
    user_id: string;
    title: string;
    category_id: string;
    day_id: string;
  }) => Promise<void>;
  getMany: (_: { userId: string; day_id?: string }) => Promise<Task[]>;
  getOne: (_: { id: string }) => Promise<Task>;
  update: (_: { id: string; data: Partial<Task> }) => Promise<void>;
  delete: (_: { id: string }) => Promise<void>;
};
