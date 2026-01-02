/**
 * Shared types used across client and server
 * These are clean domain models without database-specific fields
 */

export enum UserRoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}



export { NodeEnv } from './environment.types';