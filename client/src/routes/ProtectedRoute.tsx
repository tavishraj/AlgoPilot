import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from './paths';

interface ProtectedRouteProps {
  children: ReactNode;
  isAllowed?: boolean;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  isAllowed = true,
  redirectTo = ROUTE_PATHS.dashboard,
  requireAuth = false,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (requireAuth && !isAllowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
