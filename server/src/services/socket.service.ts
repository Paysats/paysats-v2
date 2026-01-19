import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '@/utils/logger';
import { config } from '@/config/config';

let io: Server;

/**
 * Initialize the Socket.IO server
 */
export const initSocketService = (httpServer: HttpServer): void => {
    io = new Server(httpServer, {
        cors: {
            origin: [config.app.FRONTEND_URL, "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
    });

    io.on('connection', (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // Join a room based on transaction reference
        socket.on('join_transaction', (reference: string) => {
            if (reference) {
                socket.join(reference);
                logger.info(`Socket ${socket.id} joined transaction room: ${reference}`);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    logger.info('Socket.IO initialized');
};

/**
 * Emit a payment update to clients listening for a specific transaction
 */
export const emitPaymentUpdate = (reference: string, data: any): void => {
    if (!io) {
        logger.warn('Socket.IO not initialized, cannot emit update');
        return;
    }

    // Emit to the specific room for this transaction
    io.to(reference).emit('payment_update', {
        reference,
        ...data
    });

    logger.info(`Emitted payment_update for transaction: ${reference} to room: ${reference}`);
};
