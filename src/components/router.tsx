import { createBrowserRouter, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { ROUTES } from '@/consts';
import { AuthProvider } from '@/contexts/auth/provider';
import { QueryProvider } from '@/contexts/query/provider';
import { Logo } from './widgets/logo';
import { UserLayout } from './layout/user-layout';

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

export const router = createBrowserRouter([
  {
    element: (
      <QueryProvider>
        <AuthProvider>
          <UserLayout>
            <Suspense fallback={<Logo />}>
              <main
                className='h-full min-h-dvh w-full max-w-3xl mx-auto flex gap-4 flex-col'
                style={{ viewTransitionName: 'page' }}
              >
                <Outlet />
              </main>
            </Suspense>
          </UserLayout>
        </AuthProvider>
      </QueryProvider>
    ),
    children: [
      { path: ROUTES.MAIN, element: <MainPage /> },
      { path: ROUTES.AUTH, element: <AuthPage /> },
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.TASK, element: <TaskPage /> },
      { path: ROUTES.LEADERBOARD, element: <LeaderBoard /> },
      { path: ROUTES.HABITS, element: <HabitsPage /> },
    ],
  },
]);
