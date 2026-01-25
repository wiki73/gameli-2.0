import { type Session, type User as SupabaseUser } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';
import type { Nullable } from '../types';

export type User = {
  id: string;
  name: string;
  exp: number;
  money: number;
  level: number;
};

type GetManyUsersResponse = {
  data: User[];
  total: number;
};

export type AuthApiType = {
  session: {
    get: () => Promise<Nullable<Session> | null>;
  };
  user: {
    get: (userId: string) => Promise<Nullable<User>>;
    getMany: (params: {
      page: number;
      limit: number;
    }) => Promise<GetManyUsersResponse>;
    update: (params: { userId: string; data: Partial<User> }) => Promise<User>;
  };
  login: (params: {
    email: string;
    password: string;
  }) => Promise<SupabaseUser | AuthError>;
  register: (params: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<SupabaseUser | AuthError>;
  signOut: () => Promise<void>;
};
