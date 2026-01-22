const getEnv = <K extends keyof ImportMetaEnv>(key: K): ImportMetaEnv[K] => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing env variable: ${String(key)}`);
  }

  return value;
};

export const supabaseConfig = {
  url: getEnv('VITE_SUPABASE_URL'),
  key: getEnv('VITE_SUPABASE_KEY'),
};
