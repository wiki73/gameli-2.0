export type Category = {
  id: string;
  name: string;
  description: string;
  ratio: number;
};

export type CategoryApiType = {
  create: (_: {
    userId: string;
    name: string;
    description: string;
    ratio: number;
  }) => Promise<void>;
  getMany: (_: { userId: string }) => Promise<Category[]>;
  delete: (_: { id: string }) => Promise<void>;
};
