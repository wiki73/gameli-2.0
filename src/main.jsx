import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { registerSW } from 'virtual:pwa-register';
import { QueryProvider } from './contexts/query-context/provider';
import { AuthProvider } from './contexts/auth-context/provider';
import { UserLayout } from './components/layout/UserLayout';
import { Router } from './components/app/Router';
import '@fontsource/inter';

import './styles/globals.css';

registerSW({});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <UserLayout>
            <Router />
          </UserLayout>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
