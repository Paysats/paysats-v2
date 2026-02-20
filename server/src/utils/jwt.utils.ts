import jwt from 'jsonwebtoken';
import { config } from '@/config/config';

export interface TokenPayload {
    _id: string;
    email: string;
    role: string;
}

/**
 * Generate an access token for a user
 */
export const generateAccessToken = (payload: any): string => {
    return jwt.sign(payload, config.jwt.SECRET, {
        expiresIn: config.jwt.ACCESS_TOKEN_EXPIRY as any,
    });
};

/**
 * Verify an access token and return the payload
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.SECRET) as TokenPayload;
};

/**
 * Generate a refresh token for a user
 */
export const generateRefreshToken = (payload: any): string => {
    return jwt.sign(payload, config.jwt.REFRESH_SECRET, {
        expiresIn: config.jwt.REFRESH_TOKEN_EXPIRY as any,
    });
};

/**
 * Verify a refresh token and return the payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.REFRESH_SECRET) as TokenPayload;
};
