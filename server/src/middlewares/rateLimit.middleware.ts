import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";

export class RateLimitMiddleware {
  /**
   * Rate limit for login attempts - 5 attempts per 15 minutes
   */
  static loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: "🚫 Too many login attempts. Please try again in 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many login attempts. Please try again in 15 minutes."
      );
    },
  });

  /**
   * Rate limit for password reset requests - 3 attempts per 60 minutes
   */
  static passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 3, // 3 attempts
    message: "🚫 Too many password reset attempts. Please try again in 1 hour.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many password reset attempts. Please try again in 1 hour."
      );
    },
  });

  /**
   * Rate limit for refresh token requests - 30 attempts per 15 minutes
   */
  static refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 attempts
    message: "🚫 Too many refresh attempts. Please try again in 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many refresh attempts. Please try again in 15 minutes."
      );
    },
  });

  /**
   * General API rate limit - 100 requests per minute
   */
  static generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests
    message: "🚫 Too many requests. Please try again in 1 minute.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many requests. Please try again in 1 minute."
      );
    },
  });

  /**
   * Rate limit for waitlist username checks - 20 attempts per minute
   */
  static waitlistCheckLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 checks per minute
    message: "🚫 Too many username checks. Please try again in 1 minute.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many username checks. Please slow down."
      );
    },
  });

  /**
   * Rate limit for waitlist reservations - 3 attempts per 15 minutes
   */
  static waitlistReserveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 reservations
    message: "🚫 Too many reservation attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many reservation attempts. Please try again in 15 minutes."
      );
    },
  });

  // Strict rate limiter for sensitive operations (verification, etc.)
  static strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: "🚫 Too many attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many attempts. Please try again in 15 minutes."
      );
    },
  });

  /**
   * Rate limit for waitlist reservations - 3 attempts per 15 minutes
   */
  static waitlistVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 verifications per minute
    message: "🚫 Too many verification attempts. Please try again in 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      responseHandler.tooManyRequests(
        res,
        "🚫 Too many verification attempts. Please try again in 15 minutes."
      );
    },
  });
}
