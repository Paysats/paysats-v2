import express from 'express';
import { handlePromptCashWebhook } from '@/controllers/webhook.controller';

const router = express.Router();

/**
 * POST /webhooks/promptcash
 * Receive payment confirmation callbacks from Prompt.cash
 */
router.post('/promptcash', handlePromptCashWebhook);

export default router;
