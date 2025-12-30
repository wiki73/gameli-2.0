import React from 'react';

import CenterPanel from './components/CenterPanel/CenterPanel';
import LeftPanel from './components/LeftPanel/LeftPanel';
import Login from './components/Login';
import Register from './components/Register';
import RightPanel from './components/RightPanel/RightPanel';
import ToDoList from './components/ToDoList';
import { useUser } from './context';
import './App.css';

const App = () => {
  const { userId } = useUser();

  if (!userId) {
    return (
      <>
        <Register />
        <Login />
      </>
    );
  }
  return (
    <div className='App'>
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
      <ToDoList />
    </div>
  );
};

export default App;
