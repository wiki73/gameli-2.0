import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'images/favicon.ico',
        'images/logo192.png',
        'images/logo512.png',
      ],
      manifest: {
        name: 'Gameli',
        short_name: 'Gameli',
        description: 'Gameli PWA',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
