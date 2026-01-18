export type Task = {
  id: string;
  title: string;
  category_id: string;
  date: string;
  is_done: boolean;
  user_id: string;
};

export type TasksApiType = {
  create: (_: {
    userId: string;
    title: string;
    categoryId: string;
    date: string;
  }) => Promise<void>;
  getMany: (_: { userId: string; date?: string }) => Promise<Task[]>;
  getOne: (_: { id: string }) => Promise<Task>;
  update: (task: Partial<Task>) => Promise<void>;
  delete: (_: { id: string }) => Promise<void>;
};
