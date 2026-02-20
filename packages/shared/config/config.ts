/// <reference types="node" />
import { NodeEnv } from "@shared/types";

const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env[key]) {
    return import.meta.env[key];
  }

  try {
    return process.env[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

const NODE_ENVIRONMENT = (getEnv('NODE_ENV') as NodeEnv) || NodeEnv.DEVELOPMENT;

// app config export
const app = {
  NAME: getEnv('VITE_APP_NAME', 'PaySats'),
  FRONTEND_URL: getEnv('VITE_FRONTEND_URL', 'http://localhost:3000'),
  API_URL: getEnv('VITE_API_URL', 'http://localhost:8000/api/v1'),
  SUPPORT_EMAIL: getEnv('VITE_SUPPORT_EMAIL', 'support@trypaysats.xyz'),
  X_HANDLE: getEnv('VITE_X_HANDLE', 'trypaysats'),
}

export const config = {
  NODE_ENVIRONMENT,
  app,
};
