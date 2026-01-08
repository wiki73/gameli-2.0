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
  if (!userId) {
    throw new Error('updateUser: userId is required');
  }

  const { error, data: updatedData } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return updatedData;
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

const getDayListsByUserId = async userId => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('day_lists')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return data;
};

const getDay = async userId => {
  const { data: unsortedDayLists, error: dayListsError } = await supabase
    .from('day_lists')
    .select('*')
    .eq('user_id', userId);

  if (dayListsError) {
    throw dayListsError;
  }

  const dayLists = unsortedDayLists.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getDate(),
  );

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('date', dayLists[0]?.date)
    .eq('user_id', userId);

  if (tasksError) {
    throw tasksError;
  }

  return { dayLists, tasks };
};

const getTasksByUserId = async userId => {
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (tasksError) {
    throw tasksError;
  }

  return tasks;
};

const getTasksByUserIdAndDate = async (userId, date) => {
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);

  if (tasksError) {
    throw tasksError;
  }

  return tasks;
};

const getCategories = async userId => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

const createCategory = async ({ userId, name, description, ratio }) => {
  if (!userId || !name || ratio === undefined) {
    throw new Error('createCategory: field is required');
  }
  const { data, error } = await supabase.from('categories').insert({
    user_id: userId,
    name,
    description,
    ratio,
  });

  if (error) throw error;
  return data;
};

const deleteCategory = async ({ userId, id }) => {
  const { error, data } = await supabase.from('categories').delete().match({
    id,
    user_id: userId,
  });

  if (error) throw error;
  return data;
};

const createTask = async ({ userId, title, categoryId, date }) => {
  if (!userId || !title || !categoryId || !date) {
    throw new Error('createTask: field is required');
  }

  const { error } = await supabase.from('tasks').insert({
    user_id: userId,
    title,
    category_id: categoryId,
    date,
  });

  if (error) throw error;
};

const deleteTask = async ({ id }) => {
  const { error } = await supabase.from('tasks').delete().match({
    id,
  });
  if (error) throw error;
};

const createDateForDayList = async ({ userId, date }) => {
  if (!userId || !date) {
    throw new Error('createDayList: userId and date are required');
  }

  // Проверяем, нет ли уже списка на эту дату
  const { data: existingList, error: checkError } = await supabase
    .from('day_lists')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  if (existingList) {
    throw new Error('Список на эту дату уже существует');
  }

  // Создаем новый список
  const { data, error } = await supabase
    .from('day_lists')
    .insert({
      user_id: userId,
      date,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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
  getTasks: getTasksByUserIdAndDate,
  getTasksByUserId,
  getDayListsByUserId,
  getCategories,
  createCategory,
  deleteCategory,
  createTask,
  deleteTask,
  createDateForDayList,
};
