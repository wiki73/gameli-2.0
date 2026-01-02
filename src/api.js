import { supabase } from './supabase';

const getTasksByListId = async listId => {
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('day_list_id', listId);
  return data;
};

const getUsersListByUser = async userId => {
  let list = [];
  if (!userId) return list;
  list = (
    await supabase.from('day_lists').select('*').eq('user_id', userId)
  ).data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getDate(),
  );

  if (!list?.length) {
    await supabase.from('day_lists').insert([
      {
        user_id: userId,

        date: new Date(Date.now()),
      },
    ]);

    list = (
      await supabase.from('day_lists').select('*').eq('user_id', userId)
    ).data.sort((a, b) => b.date - a.date);
  }
  return list;
};

// const getDateByUser = async (userId) => {
//     const { data } = await supabase
//         .from('day_lists')
//         .select('date')
//         .eq('user_id', userId)
//     return data;

// }

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
  getTasksByListId,
  getDayListsByUser: getUsersListByUser,
  getDay,
};
