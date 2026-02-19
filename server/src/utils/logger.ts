import winston from 'winston';
import { NodeEnv } from '@shared/types';
const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Console log format
const consoleLogFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (stack) msg += `\n${stack}`;
  if (Object.keys(metadata).length > 0) msg += `\n${JSON.stringify(metadata, null, 2)}`;
  return msg;
});

// File log format (JSON)
const fileLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Console format (colorized)
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  consoleLogFormat
);

// Log level based on environment
const getLogLevel = (): string => {
  const env = process.env.NODE_ENV as NodeEnv;
  switch (env) {
    case NodeEnv.PRODUCTION: return 'info';
    case NodeEnv.TEST: return 'warn';
    case NodeEnv.DEVELOPMENT:
    default: return 'debug';
  }
};

// Determine transports
const transports: winston.transport[] = [
  new winston.transports.Console({ format: consoleFormat }),
];

// Add file transports only if NOT on Vercel
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
  );
}

// Create logger
const logger = winston.createLogger({
  level: getLogLevel(),
  format: fileLogFormat,
  defaultMeta: {
    service: 'paysats-server',
    environment: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
  },
  transports,
  exceptionHandlers: !process.env.VERCEL ? [
    new winston.transports.File({ filename: 'logs/exceptions.log', maxsize: 5242880, maxFiles: 3 }),
  ] : [],
  rejectionHandlers: !process.env.VERCEL ? [
    new winston.transports.File({ filename: 'logs/rejections.log', maxsize: 5242880, maxFiles: 3 }),
  ] : [],
});

// Disable logging in test environment if needed
if (process.env.NODE_ENV === NodeEnv.TEST) {
  logger.clear();
  logger.add(new winston.transports.Console({ format: consoleFormat, silent: true }));
}

// Morgan stream
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};

// Helper loggers (unchanged)
export const loggers = {
  db: {
    connected: (uri: string) => logger.info('📊 Database connected', { uri: uri.replace(/\/\/.*@/, '//***@') }),
    disconnected: () => logger.warn('📊 Database disconnected'),
    error: (error: Error) => logger.error('📊 Database error', { error: error.message, stack: error.stack }),
  },
  server: {
    started: (port: number, env: string) => logger.info(`🚀 Server started on port ${port} in ${env} mode`),
    stopped: () => logger.info('🛑 Server stopped'),
    error: (error: Error) => logger.error('🛑 Server error', { error: error.message, stack: error.stack }),
  },
  request: {
    received: (method: string, url: string, ip?: string) => logger.http('📥 Request received', { method, url, ip }),
    completed: (method: string, url: string, statusCode: number, duration: number) =>
      logger.http('📤 Request completed', { method, url, statusCode, duration: `${duration}ms` }),
    error: (method: string, url: string, error: Error) =>
      logger.error('❌ Request error', { method, url, error: error.message, stack: error.stack }),
  },
  auth: {
    login: (userId: string) => logger.info('🔐 User logged in', { userId }),
    logout: (userId: string) => logger.info('🔓 User logged out', { userId }),
    failed: (reason: string, ip?: string) => logger.warn('🔐 Authentication failed', { reason, ip }),
    registered: (userId: string) => logger.info('✅ User registered', { userId }),
  },
  app: {
    info: (message: string, meta?: object) => logger.info(message, meta),
    warn: (message: string, meta?: object) => logger.warn(message, meta),
    error: (message: string, error?: Error) => logger.error(message, { error: error?.message, stack: error?.stack }),
    debug: (message: string, meta?: object) => logger.debug(message, meta),
  },
};

export default logger;
