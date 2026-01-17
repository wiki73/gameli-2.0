import { Route, Routes } from 'react-router';
import { DashboardPage } from '@/components/pages/dashboard/DashboardPage';
import { AuthPage } from '@/components/pages/auth/AuthPage';
import { ProfilePage } from '@/components/pages/profile/ProfilePage';
import { DayPage } from '@/components/pages/day/DayPage';
import { ROUTES } from '@/constants/routes';
import { TaskPage } from '@/components/pages/task/TaskPage';

export const Router = () => (
  <Routes>
    <Route
      element={<AuthPage />}
      path={ROUTES.AUTH}
    />
    <Route
      element={<ProfilePage />}
      path={ROUTES.PROFILE}
    />
    <Route
      element={<DayPage />}
      path={ROUTES.PLANNING}
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
