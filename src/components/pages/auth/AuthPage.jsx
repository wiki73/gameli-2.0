import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/auth-context';
import { ROUTES } from '../../../constants/routes';
import { AuthForm } from './AuthForm/AuthForm';
import styles from './AuthPage.module.css';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      navigate(ROUTES.MAIN);
    }
  }, [navigate, user?.id]);

  return (
    <div className={styles.page}>
      <AuthForm />
    </div>
  );
};
