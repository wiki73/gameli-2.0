import LeftPanel from './LeftPanel/LeftPanel';
import CenterPanel from './CenterPanel/CenterPanel';
import RightPanel from './RightPanel/RightPanel';
import ToDoList from './ToDoList';
import './App.css';

export const MainPage = () => (
  <div className='App'>
    <LeftPanel />
    <CenterPanel />
    <RightPanel />
    <ToDoList />
  </div>
);
