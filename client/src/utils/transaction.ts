/**
 * Transaction utility functions
 */

/**
 * Check if a transaction has expired
 * Transactions expire after 15 minutes of inactivity
 */
export const isTransactionExpired = (createdAt: string): boolean => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    
    return (now - created) > fifteenMinutes;
};

/**
 * Get remaining time for a transaction in seconds
 */
export const getTransactionTimeRemaining = (createdAt: string): number => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    const elapsed = now - created;
    const remaining = fifteenMinutes - elapsed;
    
    return Math.max(0, Math.floor(remaining / 1000));
};

/**
 * Format time remaining as MM:SS
 */
export const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Transaction status helpers
 */
export const isTransactionPending = (status: string): boolean => {
    return status === 'PENDING';
};

export const isTransactionConfirmed = (status: string): boolean => {
    return status === 'PAYMENT_CONFIRMED' || status === 'PROCESSING';
};

export const isTransactionComplete = (status: string): boolean => {
    return status === 'SUCCESS';
};

export const isTransactionFailed = (status: string): boolean => {
    return status === 'FAILED' || status === 'CANCELLED' || status === 'EXPIRED';
};

export const isTransactionFinal = (status: string): boolean => {
    return isTransactionComplete(status) || isTransactionFailed(status);
};
