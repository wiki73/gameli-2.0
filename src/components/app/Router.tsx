import { Route, Routes } from 'react-router';
import { AuthPage } from '@/components/pages/auth/AuthPage';
import { DashboardPage } from '@/components/pages/dashboard/DashboardPage';
import { MainPage } from '@/components/pages/day/MainPage';
import { ProfilePage } from '@/components/pages/profile/ProfilePage';
import { TaskPage } from '@/components/pages/task/TaskPage';
import { ROUTES } from '@/constants/routes';

export const Router = () => (
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
);
