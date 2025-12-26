import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import { Provider } from './context';
import './App.css';
import ToDoList from './components/ToDoList';
import Register from './components/Register';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);


  if (!user) {
    return (
    <>
      <Register />
      <Login/>
    </>
    );
  }
  return (
    <Provider>
      <div className="App">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
        <ToDoList />
      </div>
    </Provider>
  );
}

export default App;
