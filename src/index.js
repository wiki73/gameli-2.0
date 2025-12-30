/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App';
import { Provider } from './context';
import Login from './components/Login';
import Register from './components/Register';

import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route
            element={<App />}
            path='/'
          />
          <Route
            element={<Register />}
            path='/register'
          />
          <Route
            element={<Login />}
            path='/login'
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
