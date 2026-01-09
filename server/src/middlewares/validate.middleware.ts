import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { responseHandler } from '@/utils/responseHandler';
import logger from '@/utils/logger';

/**
 * Middleware to validate request data using Zod schemas
 * The schema should define body, params, and/or query validation
 */
export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the entire request object with body, params, and query
            const validated = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
              }) as {
                body?: unknown;
                params?: unknown;
                query?: unknown;
              };
            
            // mutate the request objects instead of creating new objects
            // Mutate existing objects instead of reassigning
      if (validated.body && typeof validated.body === 'object') {
        Object.assign(req.body, validated.body);
      }

      if (validated.params && typeof validated.params === 'object') {
        Object.assign(req.params, validated.params);
      }

      if (validated.query && typeof validated.query === 'object') {
        Object.assign(req.query, validated.query);
      }

            
            next();
        } catch (error) {
            logger.error('Validation error:', error);
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                
                return responseHandler.badRequest(res, 'Validation failed', errorMessages);
            }
            
            return responseHandler.serverError(res, 'Validation error');
        }
    };
};
