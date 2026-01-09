import {NodeEnv} from "@shared/types";
import dotenv from "dotenv";
dotenv.config();

const NODE_ENVIRONMENT = (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEVELOPMENT;
const DEV_MONGODB_URI = process.env.DEV_MONGODB_URI || "mongodb://localhost:27017/aboutly-dev";
const PROD_MONGODB_URI = process.env.PROD_MONGODB_URI || "mongodb://localhost:27017/aboutly-prod";
const MONGODB_URI = NODE_ENVIRONMENT === NodeEnv.PRODUCTION  ? PROD_MONGODB_URI : DEV_MONGODB_URI;

// jwt
const jwt: { [key: string]: string } = {
  SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "7d",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "14d",
};

// Google OAuth
const google = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "http://localhost:8000/api/auth/google/callback",
};

// app config export
const app = {
    NAME: process.env.APP_NAME || "aboutly",
    PORT: process.env.PORT || 4000,
    BASE_URL: process.env.APP_BASE_URL || `http://localhost:${process.env.APP_PORT || 4000}`,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
}

// Waitlist config
const waitlist = {
    LAUNCH_DATE: new Date(process.env.LAUNCH_DATE || '2025-12-22'), 
    RESERVATION_GRACE_DAYS: 10, // Days after launch before reservations expire
    get EXPIRY_DATE() {
        const expiry = new Date(this.LAUNCH_DATE);
        expiry.setDate(expiry.getDate() + this.RESERVATION_GRACE_DAYS);
        return expiry;
    },
}

const vtpass = {
    API_URL: process.env.VTPASS_API_URL || "https://sandbox.vtpass.com/api",
    API_KEY: process.env.VTPASS_API_KEY || "",
    PUBLIC_KEY: process.env.VTPASS_PUBLIC_KEY || "",
    SECRET_KEY: process.env.VTPASS_SECRET_KEY || "",
};

// prompt.cash config
const promptCash = {
    PUBLIC_TOKEN: process.env.PROMPT_CASH_PUBLIC_TOKEN || '',
    SECRET_TOKEN: process.env.PROMPT_CASH_SECRET_TOKEN || '',
};

// ipwho.org API key
const ipwhoApiKey = process.env.IP_WHO_API_KEY;

// Resend email config
const email = {
  API_KEY: process.env.RESEND_API_KEY || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'Aboutly <onboarding@aboutly.xyz>',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@aboutly.xyz',
};

export const config = {
  NODE_ENVIRONMENT,
  MONGODB_URI,
  jwt,
  google,
  app,
  waitlist,
  ipwhoApiKey,
  email,
  vtpass,
  promptCash,
};