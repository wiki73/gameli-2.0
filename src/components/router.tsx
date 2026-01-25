import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { ROUTES } from '@/consts';
import { Logo } from './widgets/logo';

const AuthPage = lazy(() =>
  import('@/components/pages/auth/auth-page').then(module => ({
    default: module.AuthPage,
  })),
);

const DashboardPage = lazy(() =>
  import('@/components/pages/dashboard/dashboard-page').then(module => ({
    default: module.DashboardPage,
  })),
);

const MainPage = lazy(() =>
  import('@/components/pages/main/main-page').then(module => ({
    default: module.MainPage,
  })),
);

const ProfilePage = lazy(() =>
  import('@/components/pages/profile/profile-page').then(module => ({
    default: module.ProfilePage,
  })),
);

const TaskPage = lazy(() =>
  import('@/components/pages/task/task-page').then(module => ({
    default: module.TaskPage,
  })),
);

const LeaderBoard = lazy(() =>
  import('@/components/pages/leaderboard/leaderboard-page').then(module => ({
    default: module.LeaderBoard,
  })),
);

const HabitsPage = lazy(() =>
  import('@/components/pages/habits/habits-page').then(module => ({
    default: module.HabitsPage,
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
      <Route
        element={<LeaderBoard />}
        path={ROUTES.LEADERBOARD}
      />
      <Route
        element={<HabitsPage />}
        path={ROUTES.HABITS}
      />
    </Routes>
  </Suspense>
);
