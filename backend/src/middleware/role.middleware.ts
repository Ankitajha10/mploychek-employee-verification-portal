import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces that req.user has one of the allowed roles.
 * Returns HTTP 403 Forbidden if the user's role is not authorized.
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to role verification.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Operation requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
      return;
    }

    next();
  };
};
