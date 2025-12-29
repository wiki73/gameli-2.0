import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { Provider } from './context';
import { BrowserRouter, Route, Routes } from 'react-router';
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
            path='/'
            element={<App />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
