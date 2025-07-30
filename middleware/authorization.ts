import type { ServerResponse } from "http";
import type { AuthenticatedRequest } from "./authentication";
import type { User } from "../models";

/**
 * Middleware to authorize user roles for protected routes.
 *
 * @param {...string} roles - Allowed roles for the route.
 * @returns {Function} Middleware function that checks if the user has one of the allowed roles.
 */
export const authorizeRoles = (...roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: ServerResponse
  ): Promise<boolean> => {
    const userRole = (req.user as User)?.role;

    if (!userRole || !roles.includes(userRole)) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return false;
    }
    return true;
  };
};
