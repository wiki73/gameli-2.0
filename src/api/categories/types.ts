export type Category = {
  id: string;
  name: string;
  description: string;
  ratio: number;
  experience: number;
  level: number;
  updated_at: Date;
  created_at: Date;
  user_id: string;
};

type GetManyCategoriesResponse = {
  data: Category[];
  total: number;
};

export type CategoryApiType = {
  create: (_: {
    userId: string;
    name: string;
    description: string;
    ratio: number;
  }) => Promise<void>;
  update: (_: { id: string; data: Partial<Category> }) => Promise<void>;
  getMany: (_: {
    userId: string;
    page?: number;
    limit?: number;
  }) => Promise<GetManyCategoriesResponse>;
  getOne: (_: { id: string }) => Promise<Category>;
  delete: (_: { id: string }) => Promise<void>;
};
