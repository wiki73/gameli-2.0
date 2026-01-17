import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Nullable } from '../types';

export type User = {
  id: string;
  name: string;
  exp: number;
  money: number;
  level: number;
};

export type AuthApiType = {
  session: {
    get: () => Promise<Nullable<Session>>;
  };
  user: {
    get: (userId: string) => Promise<Nullable<User>>;
    update: (params: { userId: string; data: Partial<User> }) => Promise<User>;
  };
  login: (params: { email: string; password: string }) => Promise<SupabaseUser>;
  register: (params: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<SupabaseUser>;
  signOut: () => Promise<void>;
};
