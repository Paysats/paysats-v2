import { Router } from "express";
import { AdminController } from "@/controllers/admin.controller";
import { validate } from "@/middlewares/validate.middleware";
import { adminLoginSchema, toggleServiceSchema, updateRateSchema, retryFulfillmentSchema } from "@/validators/admin.validator";
import { authenticate, roleChecker } from "@/middlewares/auth.middleware";
import { UserRoleEnum } from "@shared/types";

const router = Router();

// Public admin routes
router.post("/login", validate(adminLoginSchema), AdminController.login);

// Protected admin routes
router.use(authenticate);
router.use(roleChecker(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN));

router.get("/stats", AdminController.getStats);
router.get("/transactions", AdminController.getTransactions);
router.get("/transactions/:reference", AdminController.getTransactionDetails);
router.post("/transactions/:reference/retry", validate(retryFulfillmentSchema), AdminController.retryFulfillment);

router.post("/services/:serviceType/toggle", validate(toggleServiceSchema), AdminController.toggleService);
router.post("/rates/update", validate(updateRateSchema), AdminController.updateRate);
router.get("/settings", AdminController.getSettings);

export default router;
