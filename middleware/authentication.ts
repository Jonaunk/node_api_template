import type { IncomingMessage, ServerResponse } from "http";
import { JsonWebTokenError, verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import { config } from "../config";

/**
 * Extends IncomingMessage to include authenticated user information.
 * @property {JwtPayload | string} [user] - User information extracted from the JWT token.
 */
export interface AuthenticatedRequest extends IncomingMessage {
  user?: JwtPayload | string;
}

/**
 * Middleware to authenticate JWT tokens in HTTP requests.
 *
 * - Checks for the presence and validity of the token in the Authorization header.
 * - Verifies if the token has been revoked.
 * - Decodes the token and adds user information to the request.
 * - Responds with the appropriate HTTP status code if authentication fails.
 *
 * @param {AuthenticatedRequest} req - HTTP request extended with user info.
 * @param {ServerResponse} res - HTTP response.
 * @returns {Promise<boolean>} true if authentication is successful, false otherwise.
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Un" }));
    return false;
  }

  if(isTokenRevoked(token)){
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }

  try {
    const decoded = verify(token, config.jwtSecret);

    req.user = decoded;

    return true;
  } catch (_err) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }

};
