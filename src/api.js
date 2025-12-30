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
  list = (await supabase.from('day_lists').select('*').eq('user_id', userId))
    .data;

  if (!list?.length) {
    await supabase.from('day_lists').insert([
      {
        user_id: userId,
        date: new Date(Date.now()),
      },
    ]);

    list = (await supabase.from('day_lists').select('*').eq('user_id', userId))
      .data;
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

export const api = { getTasksByListId, getDayListsByUser: getUsersListByUser };
