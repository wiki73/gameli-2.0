/// <reference types="vite/client" />
declare module '@fontsource/inter/latin';

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly EXP_LOW: number;
  readonly EXP_MEDIUM: number;
  readonly EXP_HIGH: number;
  readonly EXP_VERY_HIGH: number;
  [key: string]: unknown;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
