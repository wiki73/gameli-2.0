import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/auth-context';
import { ROUTES } from '../../../constants/routes';
import { Spinner } from '../../common/spinner/Spinner';
import LeftPanel from './LeftPanel/LeftPanel';
import CenterPanel from './CenterPanel/CenterPanel';
import RightPanel from './RightPanel/RightPanel';
import ToDoList from './ToDoList';
import './App.css';

const App = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [navigate, isLoading, user]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return null;
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
