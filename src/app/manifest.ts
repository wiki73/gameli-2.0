import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gameli - Приложениие планирования и организации задач',
    short_name: 'Gameli',
    description: 'Приложениие планирования и организации задач',
    start_url: '/',
    display: 'standalone',
    background_color: '#dedede',
    theme_color: '#222',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
