import mongoose from 'mongoose';
import logger, { loggers } from '../utils/logger';
import { config } from './config';
import { NodeEnv } from '@shared/types';


// MongoDB connection options
const options = {
  autoIndex: true,
  connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
  socketTimeoutMS: 45000,  // Close sockets after 45 secs of inactivity
  family: 4                // Use IPv4, skip trying IPv6
};

// Connect to MongoDB
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI, options);

    loggers.db.connected(config.MONGODB_URI);

    // Log connection state changes
    mongoose.connection.on('disconnected', () => {
      loggers.db.disconnected();
    });

    mongoose.connection.on('error', (error: Error) => {
      loggers.db.error(error);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('📊 Database reconnected');
    });

  } catch (error) {
    loggers.db.error(error as Error);

    // Exit process in production if DB connection fails
    if (config.NODE_ENVIRONMENT === NodeEnv.PRODUCTION) {
      logger.error('💥 Fatal: Unable to connect to database in production. Exiting...');
      process.exit(1);
    }

    throw error;
  }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    loggers.db.disconnected();
  } catch (error) {
    loggers.db.error(error as Error);
    throw error;
  }
};

// Health check
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export default { connectDatabase, disconnectDatabase, isDatabaseConnected };