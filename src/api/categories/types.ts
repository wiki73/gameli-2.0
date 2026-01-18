export type Category = {
  id: string;
  name: string;
  description: string;
  ratio: number;
  expirence: number;
};

export type CategoryApiType = {
  create: (_: {
    userId: string;
    name: string;
    description: string;
    ratio: number;
  }) => Promise<void>;
  update: (category: Partial<Category>) => Promise<void>;
  getMany: (_: { userId: string }) => Promise<Category[]>;
  getOne: (_: { id: string }) => Promise<Category>;
  delete: (_: { id: string }) => Promise<void>;
};
