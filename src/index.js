/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './components/pages/main/App';
import { AuthPage } from './components/pages/auth/AuthPage';
import { AuthProvider } from './contexts/auth-context/provider';
import { ROUTES } from './constants/routes';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route
              element={<App />}
              path={ROUTES.MAIN}
            />
            <Route
              element={<AuthPage />}
              path={ROUTES.AUTH}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
