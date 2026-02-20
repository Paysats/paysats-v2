import express from 'express';
import { UtilityController } from '@/controllers/utility.controller';

const router = express.Router();

router.get('/data-plans/:network', UtilityController.getDataPlans);

export default router;
