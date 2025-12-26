import { supabase } from '../supabase';

export const supabaseConfig = {
  url: process.env.REACT_APP_SUPABASE_URL,
  key: process.env.REACT_APP_SUPABASE_KEY,
};

export const userId = process.env.REACT_APP_USER_ID;
