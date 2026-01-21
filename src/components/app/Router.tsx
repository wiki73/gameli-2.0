import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { ROUTES } from '@/constants/routes';
import { Logo } from '../common/Logo/Logo';

const AuthPage = lazy(() =>
  import('@/components/pages/auth/AuthPage').then(module => ({
    default: module.AuthPage,
  })),
);

const DashboardPage = lazy(() =>
  import('@/components/pages/dashboard/DashboardPage').then(module => ({
    default: module.DashboardPage,
  })),
);

const MainPage = lazy(() =>
  import('@/components/pages/day/MainPage').then(module => ({
    default: module.MainPage,
  })),
);

const ProfilePage = lazy(() =>
  import('@/components/pages/profile/ProfilePage').then(module => ({
    default: module.ProfilePage,
  })),
);

const TaskPage = lazy(() =>
  import('@/components/pages/task/TaskPage').then(module => ({
    default: module.TaskPage,
  })),
);

export const Router = () => (
  <Suspense fallback={<Logo />}>
    <Routes>
      <Route
        element={<MainPage />}
        path={ROUTES.MAIN}
      />
      <Route
        element={<AuthPage />}
        path={ROUTES.AUTH}
      />
      <Route
        element={<ProfilePage />}
        path={ROUTES.PROFILE}
      />

      <Route
        element={<DashboardPage />}
        path={ROUTES.DASHBOARD}
      />
      <Route
        element={<TaskPage />}
        path={ROUTES.TASK}
      />
    </Routes>
  </Suspense>
);
