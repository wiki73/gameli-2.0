import { supabase } from '../api';
import type { AuthApiType, User } from './types';

export const authApi: AuthApiType = {
  session: {
    get: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
  },
  user: {
    get: async userId => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single<User>();

      if (error) throw error;
      return data;
    },
    getMany: async ({ page, limit }) => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .filter('exp', 'gt', 0)
        .order('exp', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data as User[], total: count ?? 0 };
    },
    update: async ({ userId, data }) => {
      if (!userId) {
        throw new Error('updateUser: userId is required');
      }

      const { data: user, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select('*')
        .single<User>();

      if (error) throw error;

      return user;
    },
  },
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },
  register: async ({ email, password, name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data?.user?.id) throw new Error('User not created');

    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      name: name?.trim() || 'Без имени',
      exp: 0,
      money: 0,
      level: 0,
    });

    if (insertError) throw insertError;

    return data.user;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
