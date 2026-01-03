import { supabase } from './supabase';

/* ---------------- AUTH ---------------- */

const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

const getUserById = async userId => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

const updateUser = async ({ userId, data }) => {
  const { error } = await supabase.from('users').update(data).eq('id', userId);

  if (error) throw error;
  return data;
};

const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

const register = async ({ email, password, name }) => {
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
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/* ---------------- YOUR EXISTING API ---------------- */

const getTasksByListId = async listId => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('day_list_id', listId);

  if (error) throw error;
  return data;
};

const getDayListsByUser = async userId => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('day_lists')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

const getDay = async userId => {
  const { data: unsortedDayLists, error: dayListsError } = await supabase
    .from('day_lists')
    .select('*')
    .eq('user_id', userId);

  if (dayListsError || !unsortedDayLists?.length) {
    return { tasks: [], dayLists: [], dayListsError };
  }

  const dayLists = unsortedDayLists.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getDate(),
  );

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('date', dayLists[0].date)
    .eq('user_id', userId);

  if (tasksError) {
    return { tasks: [], tasksError, dayLists: [], dayListsError };
  }

  return { dayLists, tasks, dayListsError, tasksError };
};

export const api = {
  getSession,
  getUserById,
  updateUser,
  login,
  register,
  signOut,
  getTasksByListId,
  getDayListsByUser,
  getDay,
};
