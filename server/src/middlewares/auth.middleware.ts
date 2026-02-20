import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '@/utils/jwt.utils';
import { responseHandler } from '@/utils/responseHandler';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Middleware to authenticate requests using JWT access token
 * Token should be in Authorization header: "Bearer <token>"
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return responseHandler.unauthorized(res, 'No token provided');
        }

        const token = authHeader.replace('Bearer ', '');

        const payload = verifyAccessToken(token);
        req.user = payload;

        next();
    } catch (error) {
        return responseHandler.unauthorized(res, 'Invalid or expired token');
    }
}

/**
 * Middleware to check if user has required role
 */
export function roleChecker(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return responseHandler.unauthorized(res, 'Authentication required');
        }

        if (!allowedRoles.includes(req.user.role)) {
            return responseHandler.forbidden(res, 'Insufficient permissions');

        }

        next();
    };
}

/**
 * Optional authentication - doesn't block if no token
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyAccessToken(token);
            req.user = payload;
        }

        next();
    } catch (error) {
        // If token is invalid, just continue without user
        next();
    }
}
