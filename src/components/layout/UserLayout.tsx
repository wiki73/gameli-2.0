import { type PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/consts';
import { useAuth } from '../../contexts/auth-context';
import { Logo } from '../common/Logo/Logo';
import { Header } from './Header/Header';

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
    <main className='h-full min-h-dvh w-full max-w-3xl mx-auto pt-4 md:pt-6 px-3 md:px-0 pb-24 md:pb-4 flex gap-4 flex-col'>
      {showHeader && <Header />}
      {children}
    </main>
  );
};
