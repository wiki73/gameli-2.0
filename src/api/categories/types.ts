export type Category = {
  id: string;
  name: string;
  description: string;
  ratio: number;
  experience: number;
  level: number;
};

export type CategoryApiType = {
  create: (_: {
    userId: string;
    name: string;
    description: string;
    ratio: number;
  }) => Promise<void>;
  update: (_: { id: string; data: Partial<Category> }) => Promise<void>;
  getMany: (_: { userId: string }) => Promise<Category[]>;
  getOne: (_: { id: string }) => Promise<Category>;
  delete: (_: { id: string }) => Promise<void>;
};
