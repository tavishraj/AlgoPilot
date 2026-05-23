import { lazy } from 'react';

export const DashboardRoute = lazy(() =>
  import('@/pages/Dashboard').then((module) => ({
    default: module.DashboardPage,
  }))
);

export const PracticeRoute = lazy(() =>
  import('@/pages/Problems').then((module) => ({
    default: module.ProblemsPage,
  }))
);

export const PracticeProblemRoute = lazy(() => import('@/pages/PracticeProblem'));
export const BattlesRoute = lazy(() => import('@/pages/Battles'));
export const LeaderboardRoute = lazy(() => import('@/pages/Leaderboard'));
export const ProfileRoute = lazy(() => import('@/pages/Profile'));
export const SettingsRoute = lazy(() => import('@/pages/Settings'));
export const NotFoundRoute = lazy(() => import('@/pages/NotFound'));
