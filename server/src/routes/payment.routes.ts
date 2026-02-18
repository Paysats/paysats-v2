import { PaymentController } from "@/controllers/payment.controller";
import { validate } from "@/middlewares/validate.middleware";
import { PaymentValidator } from "@/validators/payment.validator";
import { Router } from "express";

const router = Router();

// Create airtime purchase transaction
router.post("/airtime", validate(PaymentValidator.purchaseAirtime), PaymentController.purchaseAirtime);

// Get transaction details
router.get("/transaction/:reference", PaymentController.getTransaction);

/**
 * Retry fulfillment for a paid transaction
 */
router.post("/transaction/:reference/retry", PaymentController.retryFulfillment);

export default router;