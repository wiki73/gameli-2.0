import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function requireEnv(env: Record<string, string>, key: string) {
  if (!env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  requireEnv(env, 'VITE_SUPABASE_URL');
  requireEnv(env, 'VITE_SUPABASE_KEY');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'images/favicon.ico',
          'images/icon-192x192.png',
          'images/icon-512x512.png',
        ],
        manifest: {
          name: 'Gameli',
          short_name: 'Gameli',
          description: 'Gameli - Your Gamify Task Manager',
          theme_color: '#dedede',
          background_color: '#dedede',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/images/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/images/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/images/icon-180x180.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'apple touch icon',
            },
            {
              src: '/images/icon-1024x1024.png',
              sizes: '1024x1024',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@ui': path.resolve(__dirname, 'src/components/ui'),
      },
    },
  };
});
