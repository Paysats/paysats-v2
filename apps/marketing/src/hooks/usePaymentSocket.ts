import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Use same URL as API but base
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const usePaymentSocket = (reference: string | undefined, onPaymentUpdate: (data: any) => void) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!reference) return;

        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'], // Try websocket first
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected, joining room:', reference);
            socket.emit('join_transaction', reference);
        });

        socket.on('payment_update', (data) => {
            console.log('Socket payment update:', data);
            onPaymentUpdate(data);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('payment_update');
                socket.off('disconnect');
                socket.disconnect();
            }
        };
    }, [reference]); // Re-connect if reference changes

    return socketRef;
};
