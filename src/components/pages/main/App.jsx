import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/auth-context';
import { ROUTES } from '../../../constants/routes';
import LeftPanel from './LeftPanel/LeftPanel';
import CenterPanel from './CenterPanel/CenterPanel';
import RightPanel from './RightPanel/RightPanel';
import ToDoList from './ToDoList';
import './App.css';

const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate(ROUTES.AUTH);
    }
  }, [navigate, user?.id]);

  if (!user?.id) {
    return <div>Loading...</div>;
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
