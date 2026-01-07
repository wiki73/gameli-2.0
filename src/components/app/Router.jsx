import { Route, Routes } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { MainPage } from '../pages/main/MainPage';
import { AuthPage } from '../pages/auth/AuthPage';
import { CategoryPage } from '../pages/category/CategoryPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { DayPage } from '../pages/day/DayPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

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
      element={<CategoryPage />}
      path={ROUTES.CATEGORIES}
    />
    <Route
      element={<ProfilePage />}
      path={ROUTES.PROFILE}
    />
    <Route
      element={<DayPage />}
      path={ROUTES.DAY}
    />
    <Route
      element={<DashboardPage />}
      path={ROUTES.DASHBOARD}
    />
  </Routes>
);
