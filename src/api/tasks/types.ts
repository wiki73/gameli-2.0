export type Task = {
  id: string;
  title: string;
  category_id: string;
  date: string;
};

export type TasksApiType = {
  create: (_: {
    userId: string;
    title: string;
    categoryId: string;
    date: string;
  }) => Promise<void>;
  getMany: (_: { userId: string; date?: string }) => Promise<Task[]>;
  getOne: (_: { listId: string; id: string }) => Promise<Task>;
  update: (_: {
    id: string;
    userId: string;
    title?: string;
    categoryId?: string;
    date?: string;
  }) => Promise<void>;
  delete: (_: { id: string }) => Promise<void>;
};
