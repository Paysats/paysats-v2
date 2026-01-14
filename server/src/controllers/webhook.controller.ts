import { Request, Response } from 'express';
import { TransactionService } from '@/services/transaction.service';
import { PromptCashService } from '@/services/promptcash.service';
import logger from '@/utils/logger';

/**
 * Handle Prompt.cash webhook callbacks
 */
export const handlePromptCashWebhook = async (req: Request, res: Response) => {
    const webhookReceivedAt = Date.now();
    
    try {
        const webhookPayload = req.body;
        const paymentData = webhookPayload.payment;

        logger.info('Received Prompt.cash webhook', {
            tx_id: paymentData?.tx_id,
            status: paymentData?.status,
            paid_at: paymentData?.paid,
            confirmations: paymentData?.confirmations,
            webhook_received_at: new Date(webhookReceivedAt).toISOString(),
        });

        // 1. Verify webhook signature (token is at root level)
        const isValid = PromptCashService.verifyWebhookSignature(webhookPayload);
        if (!isValid) {
            logger.error('Invalid webhook signature', { payload: webhookPayload });
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // 2. Extract transaction reference from payment.tx_id
        const reference = paymentData?.tx_id;
        if (!reference) {
            logger.error('Missing tx_id in webhook payload', { payload: webhookPayload });
            return res.status(400).json({ error: 'Missing tx_id' });
        }

        // 3. Handle payment confirmation (pass the payment object)
        await TransactionService.handlePaymentConfirmation(reference, paymentData);

        // 4. Log webhook processing time
        const processingTime = Date.now() - webhookReceivedAt;
        logger.info('Webhook processed successfully', {
            tx_id: reference,
            processing_time_ms: processingTime,
        });

        // 4. Return success
        res.status(200).json({ success: true });
    } catch (error: any) {
        logger.error('Error handling Prompt.cash webhook', {
            error: error?.message,
            payload: req.body,
        });

        // Return 200 to prevent retries for invalid data
        res.status(200).json({ success: false, error: error?.message });
    }
};
