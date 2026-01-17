import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryProvider } from '@/contexts/query-context/provider';
import { AuthProvider } from '@/contexts/auth-context/provider';
import { UserLayout } from '@/components/layout/UserLayout';
import { Router } from '@/components/app/Router';
import '@fontsource/inter';

import './styles/globals.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <UserLayout>
            <Router />
          </UserLayout>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
