import { Navigate, createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTE_PATHS } from './paths';
import {
  BattlesRoute,
  DashboardRoute,
  LeaderboardRoute,
  NotFoundRoute,
  PracticeProblemRoute,
  PracticeRoute,
  ProfileRoute,
  SettingsRoute,
} from './routeElements';

export const appRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.home,
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardRoute />,
      },
      {
        path: 'practice',
        element: <PracticeRoute />,
      },
      {
        path: 'practice/:slug',
        element: <PracticeProblemRoute />,
      },
      {
        path: 'battles',
        element: <BattlesRoute />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardRoute />,
      },
      {
        path: 'profile',
        element: <ProfileRoute />,
      },
      {
        path: 'settings',
        element: <SettingsRoute />,
      },
      {
        path: 'problems',
        element: <Navigate to={ROUTE_PATHS.practice} replace />,
      },
      {
        path: 'battle',
        element: <Navigate to={ROUTE_PATHS.battles} replace />,
      },
      {
        path: '*',
        element: <NotFoundRoute />,
      },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
