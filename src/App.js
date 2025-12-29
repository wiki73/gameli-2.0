import React from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import { Provider, useUser } from './context';
import ToDoList from './components/ToDoList';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const { userId } = useUser()

  if (!userId) {
    return (
      <>
        <Register />
        <Login />
      </>
    );
  }
  return (
    <div className="App">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
      <ToDoList />
    </div>
  );
}

export default App;
