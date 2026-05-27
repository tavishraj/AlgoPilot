import { Navigate, createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTE_PATHS } from './paths';
import { RouteFallback } from '@/components/layout/RouteFallback';
import {
  BattlesRoute,
  CodingWorkspaceRoute,
  DashboardRoute,
  LeaderboardRoute,
  NotFoundRoute,
  PracticeRoute,
  ProfileRoute,
  SettingsRoute,
} from './routeElements';

export const appRoutes: RouteObject[] = [
  // ─── Workspace Route (full viewport, no sidebar) ──────
  {
    path: 'practice/:slug',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<RouteFallback />}>
          <CodingWorkspaceRoute />
        </Suspense>
      </ProtectedRoute>
    ),
  },

  // ─── Main App Layout (with sidebar) ───────────────────
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
