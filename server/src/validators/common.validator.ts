import { RESERVED_USERNAMES, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from '@shared/constants';
import { z } from 'zod';

/**
 * Common reusable Zod validators for consistent validation across the app
 */

// MongoDB ObjectId regex pattern
const MONGO_ID_REGEX = /^[a-fA-F0-9]{24}$/;

// Username constraints
const USERNAME_MIN = USERNAME_MIN_LENGTH;
const USERNAME_MAX = USERNAME_MAX_LENGTH;

// ============================================
// Primitive Validators (building blocks)
// ============================================

/**
 * MongoDB ObjectId validator
 */
export const mongoId = z
  .string()
  .regex(MONGO_ID_REGEX, 'Invalid ID format');

/**
 * Email validator
 */
export const email = z
  .email('Invalid email address')
  .trim()
  .toLowerCase()
  .max(255, 'Email is too long');

/**
 * Username validator
 */
export const username = z
.string("Username is required")
.min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
.max(USERNAME_MAX, `Username must not exceed ${USERNAME_MAX} characters`)
      .trim()
      .toLowerCase()
      .regex(USERNAME_REGEX, 'Username can only contain lowercase letters, numbers, dots, and underscores')
      .refine((val) => /^[a-z0-9]/.test(val), {
        message: 'Username must start with a letter or number',
      })
      .refine((val) => !/[_.]{2,}/.test(val), {
        message: 'Username cannot contain consecutive dots or underscores',
      })
      .refine((val) => !RESERVED_USERNAMES.includes(val), {
        message: 'This username is reserved and cannot be used',
      });

/**
 * URL validator
 */
export const url = z
  .url('Please enter a valid URL')
  .trim()
  .max(2048, 'URL is too long');

/**
 * Optional variants
 */
export const optionalUrl = url.optional();
export const optionalEmail = email.optional();
export const optionalUsername = username.optional();
export const optionalMongoId = mongoId.optional();

// ============================================
// Ready-to-Use Schemas (pass directly to validate())
// ============================================

/**
 * Schema for routes with :id param (e.g., DELETE /:id, GET /:id)
 * Usage: validate(mongoIdParamSchema)
 */
export const mongoIdParamSchema = z.object({
  params: z.object({
    id: mongoId,
  }),
});

/**
 * Schema for routes with :userId param
 * Usage: validate(mongoIdParamSchema)
 */
export const userIdParamSchema = z.object({
  params: z.object({
    userId: mongoId,
  }),
});

/**
 * Schema for routes with :username param
 * Usage: validate(usernameParamSchema)
 */
export const usernameParamSchema = z.object({
  params: z.object({
    username,
  }),
});

/**
 * Schema for routes with only username in body
 */
export const usernameBodySchema = z.object({
  body: z.object({
    username,
  }),
});

// ============================================
// Array Validators
// ============================================

/**
 * Array of MongoDB ObjectIds
 */
export const mongoIdArray = z
  .array(mongoId)
  .min(1, 'At least one ID is required');

/**
 * Array of strings
 */
export const stringArray = z.array(z.string());

// ============================================
// Export constants for reuse
// ============================================
export const VALIDATION_CONSTANTS = {
  MONGO_ID_REGEX,
  USERNAME_REGEX,
} as const;
