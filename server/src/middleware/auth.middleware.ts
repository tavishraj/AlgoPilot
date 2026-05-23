import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';

// Placeholder auth middleware — JWT verification will go here
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError('Unauthorized — No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  // TODO: Verify JWT token and attach user to request
  // For now, just pass through with the token
  try {
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    // req.user = decoded;
    (req as any).token = token;
    next();
  } catch {
    next(createError('Unauthorized — Invalid token', 401));
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(createError('Forbidden — Insufficient permissions', 403));
    }

    next();
  };
}
