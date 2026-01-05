import LeftPanel from './LeftPanel/LeftPanel';
import ToDoList from './ToDoList';
import styles from './MainPage.module.css';

export const MainPage = () => (
  <>
    <div className={styles.page}>
      <LeftPanel />
    </div>
    <ToDoList />
  </>
);
