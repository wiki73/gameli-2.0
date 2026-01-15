import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/auth-context';
import { FullScreenSpinner } from '../common/spinner/FullScreenSpinner';
import styles from './UserLayout.module.css';
import { Header } from './Header/Header';

export const UserLayout = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [navigate, isLoading, user]);

  if (isLoading || (location.pathname !== ROUTES.AUTH && !user && !isLoading)) {
    return <FullScreenSpinner />;
  }

  return (
    <main className={styles.page}>
      {!!user && <Header />}
      {children}
    </main>
  );
};
