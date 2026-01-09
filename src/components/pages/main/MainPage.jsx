import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { appConfig } from '../../../config/env';
import { ROUTES } from '../../../constants/routes';
import LeftPanel from './LeftPanel/LeftPanel';
import ToDoList from './ToDoList';
import styles from './MainPage.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!appConfig.showMainPage) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className={styles.page}>
        <LeftPanel />
      </div>
      <ToDoList />
    </>
  );
};
