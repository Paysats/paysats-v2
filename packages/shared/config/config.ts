import { NodeEnv } from "@shared/types";

const NODE_ENVIRONMENT = (import.meta.env.NODE_ENV as NodeEnv) || NodeEnv.DEVELOPMENT;

// app config export
const app = {
  NAME: import.meta.env.VITE_APP_NAME || "PaySats",
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || "support@paysats.io",
  X_HANDLE: import.meta.env.VITE_X_HANDLE || "paysatss",
}

export const config = {
  NODE_ENVIRONMENT,
  app,
};
