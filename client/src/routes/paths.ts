export const ROUTE_PATHS = {
  home: '/',
  dashboard: '/dashboard',
  practice: '/practice',
  battles: '/battles',
  leaderboard: '/leaderboard',
  profile: '/profile',
  settings: '/settings',
  practiceProblem: (slug: string) => `/practice/${slug}`,
} as const;

type RoutePathValue = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export type StaticRoutePath = Extract<RoutePathValue, string>;
