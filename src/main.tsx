import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from '@/components/router';
import { setupOnlineSync } from './contexts/query/persist';
import { ThemeProvider } from './contexts/theme/theme-provider';
import '@fontsource/inter/latin';
import './index.css';

setupOnlineSync();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider
      defaultTheme='light'
      storageKey='vite-ui-theme'
    >
      <RouterProvider
        router={router}
        unstable_useTransitions
      />
    </ThemeProvider>
  </StrictMode>,
);
