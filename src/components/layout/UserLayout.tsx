import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/auth-context';
import { Logo } from '../common/Logo/Logo';
import { Header } from './Header/Header';
import styles from './UserLayout.module.css';

export const UserLayout = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [navigate, isLoading, user]);

  if (isLoading || (location.pathname !== ROUTES.AUTH && !user && !isLoading)) {
    return <Logo />;
  }

  const showHeader =
    !location.pathname.includes(ROUTES.TASK.replace(':taskId', '')) && !!user;

  return (
    <main className={styles.page}>
      {showHeader && <Header />}
      {children}
    </main>
  );
};
