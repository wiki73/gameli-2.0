import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '@/components/common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../contexts/auth-context';
import { AuthForm } from './AuthForm/AuthForm';
import styles from './AuthPage.module.css';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(ROUTES.MAIN, { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className={styles.page}>
      <Logo className={styles.logo} />
      <AuthForm />
    </div>
  );
};
