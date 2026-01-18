import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Router } from '@/components/app/Router';
import { UserLayout } from '@/components/layout/UserLayout';
import { AuthProvider } from '@/contexts/auth-context/provider';
import { QueryProvider } from '@/contexts/query-context/provider';
import '@fontsource/inter/latin';

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
