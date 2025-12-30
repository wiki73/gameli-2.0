/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Provider } from './contexts/context';
import App from './components/pages/main/App';
import { AuthPage } from './components/pages/auth';
import { AuthProvider } from './contexts/auth-context';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <BrowserRouter>
          <main>
            <Routes>
              <Route
                element={<App />}
                path='/'
              />
              <Route
                element={<AuthPage />}
                path='/auth'
              />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
