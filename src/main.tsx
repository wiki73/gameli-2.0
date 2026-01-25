import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Router } from '@/components/router';
import { UserLayout } from '@/components/layout/user-layout';
import { AuthProvider } from '@/contexts/auth/provider';
import { QueryProvider } from '@/contexts/query/provider';
import { setupOnlineSync } from './contexts/query/persist';
import '@fontsource/inter/latin';
import './index.css';
import { ThemeProvider } from './contexts/theme/theme-provider';

setupOnlineSync();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider
      defaultTheme='light'
      storageKey='vite-ui-theme'
    >
      <BrowserRouter unstable_useTransitions>
        <QueryProvider>
          <AuthProvider>
            <UserLayout>
              <Router />
            </UserLayout>
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
