import { useState, useEffect, useCallback } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import { supabase } from './supabase';
import { Provider } from './context';
import './App.css';
import ToDoList from './components/ToDoList';
import { userId } from './config/env';

function App() {
    const [exp, setExp] = useState(0);
    useEffect(() => {
    const load = async () => {
      const {list} = await supabase
        .from('goals')
        .select('*')
      const { data, error } = await supabase
        .from('users')
        .select('exp')
        .eq('id', userId)
        .single();

      if (!error) {
        setExp(data.exp);
      } else {
        console.log(error);
      }
    };

    load();
  }, []);



  const addExp = async () => {
    const newExp = exp + 10;

    const { error } = await supabase
      .from('users')
      .update({ exp: newExp })
      .eq('id', userId);

    if (!error) {
      setExp(newExp);
    } else {
      console.log(error);
    }
  };











  const [littleTasks, setLittleTasks] = useState([
    { id: 1, description: 'Мелкая задача 1' },
    { id: 2, description: 'Мелкая задача 2' },
    { id: 3, description: 'Мелкая задача 3' },
  ]);

  const [mediumTasks, setMediumTasks] = useState([
    { id: 1, description: 'Средняя задача 1' },
    { id: 2, description: 'Средняя задача 2' },
    { id: 3, description: 'Средняя задача 3' },
  ]);

  const [largeTasks, setLargeTasks] = useState([
    { id: 1, description: 'Большая задача 1' },
    { id: 2, description: 'Большая задача 2' },
    { id: 3, description: 'Большая задача 3' },
  ]);

  const addTask = useCallback((description, sizeTask) => {
    const newTask = { id: Date.now(), description };
    
    switch (sizeTask) {
      case 'little':
        setLittleTasks((prev) => [...prev, newTask]);
        break;
      case 'medium':
        setMediumTasks((prev) => [...prev, newTask]);
        break;
      case 'large':
        setLargeTasks((prev) => [...prev, newTask]);
        break;
      default:
        console.warn(`Unknown task size: ${sizeTask}`);
    }
  }, []);


  return (
    <Provider>
    <div className="App">
      <LeftPanel
        className="left-panel"
        littleTasks={littleTasks}
        mediumTasks={mediumTasks}
        largeTasks={largeTasks}
        addTask={addTask}
      />
      <CenterPanel className="center-panel" />
      <RightPanel />
      <ToDoList/>
    </div>
    </Provider>
  );
}

export default App;
