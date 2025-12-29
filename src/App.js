import React from 'react';
import { Navigate } from 'react-router';

import CenterPanel from './components/CenterPanel/CenterPanel';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import ToDoList from './components/ToDoList';
import { useUser } from './context';

import './App.css';

const App = () => {
  const { userId } = useUser();

  if (!userId) {
    return <Navigate to='/login' />;
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
