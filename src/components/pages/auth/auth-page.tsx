import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Logo } from '@/components/widgets/logo';
import { ROUTES } from '@/consts';
import { useAuth } from '../../../contexts/auth';
import { AuthForm } from './auth-form';
import type { To } from 'react-router';

type LocationState = {
  from?: To;
};

export const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!isLoading && user) {
      navigate(state?.from ?? ROUTES.MAIN, { replace: true });
    }
  }, [user, isLoading, navigate, state]);

  return (
    <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
      <Logo className='relative max-w-3xs w-full text-center mx-auto' />
      <AuthForm />
    </div>
  );
};
