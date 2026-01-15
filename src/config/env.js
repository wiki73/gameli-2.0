export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_KEY,
};

export const appConfig = {
  showMainPage: import.meta.env?.VITE_SHOW_MAIN_PAGE === 'true',
};
