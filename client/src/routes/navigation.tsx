import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  CircleUserRound,
  LayoutDashboard,
  Network,
  Settings2,
  Trophy,
} from 'lucide-react';
import { ROUTE_PATHS, type StaticRoutePath } from './paths';

export interface RouteMeta {
  title: string;
  subtitle: string;
}

export interface AppNavigationItem extends RouteMeta {
  href: StaticRoutePath;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const primaryNavigation: AppNavigationItem[] = [
  {
    href: ROUTE_PATHS.dashboard,
    label: 'Dashboard',
    title: 'Dashboard',
    subtitle: 'Your AI-powered DSA cockpit',
    icon: LayoutDashboard,
    end: true,
  },
  {
    href: ROUTE_PATHS.practice,
    label: 'Practice with AI',
    title: 'Practice with AI',
    subtitle: 'Problems, hints, and code review',
    icon: BrainCircuit,
  },
  {
    href: ROUTE_PATHS.battles,
    label: 'Battles',
    title: 'Battles',
    subtitle: 'Realtime coding rooms',
    icon: Network,
  },
  {
    href: ROUTE_PATHS.leaderboard,
    label: 'Leaderboard',
    title: 'Leaderboard',
    subtitle: 'Rankings and consistency',
    icon: Trophy,
  },
];

export const accountNavigation: AppNavigationItem[] = [
  {
    href: ROUTE_PATHS.profile,
    label: 'Profile',
    title: 'Profile',
    subtitle: 'Progress and identity',
    icon: CircleUserRound,
  },
  {
    href: ROUTE_PATHS.settings,
    label: 'Settings',
    title: 'Settings',
    subtitle: 'Workspace preferences',
    icon: Settings2,
  },
];

const navigationMeta = [...primaryNavigation, ...accountNavigation];

export function getRouteMeta(pathname: string): RouteMeta {
  const match = navigationMeta.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return match ?? {
    title: 'AlgoPilot',
    subtitle: 'Developer productivity platform',
  };
}
