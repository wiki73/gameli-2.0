/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryProvider } from './contexts/query-context/provider';
import { AuthProvider } from './contexts/auth-context/provider';
import { UserLayout } from './components/layout/UserLayout';
import { Router } from './components/app/Router';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
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
