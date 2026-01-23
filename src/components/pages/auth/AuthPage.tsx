import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '@/components/common/Logo/Logo';
import { ROUTES } from '@/consts';
import { useAuth } from '../../../contexts/auth-context';
import { AuthForm } from './AuthForm/AuthForm';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(ROUTES.MAIN, { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
      <Logo className='relative max-w-3xs w-full text-center mx-auto' />
      <AuthForm />
    </div>
  );
};
