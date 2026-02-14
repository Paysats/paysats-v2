import { TransactionService } from "@/services/transaction.service";
import { catchAsAsync } from "@/utils/catchAsAsync";
import { sendSuccess } from "@/utils/responseHandler";
import { Request, Response } from "express";

export class PaymentController {
    /**
     * Create airtime purchase transaction
     * Returns payment details (BCH address, QR code, etc.)
     */
    static purchaseAirtime = catchAsAsync(async (req: Request, res: Response) => {
        const { network, phoneNumber, amount } = req.body;

        console.log("Received purchaseAirtime request with body:", req.body);

        // Create transaction and get payment details
        const result = await TransactionService.createAirtimeTransaction({
            network,
            phoneNumber,
            amount
        });

        return sendSuccess({
            res,
            data: result,
            message: "Transaction created successfully. Please complete payment."
        });
    });

    /**
     * Get transaction details by reference
     */
    static getTransaction = catchAsAsync(async (req: Request, res: Response) => {
        const { reference } = req.params;

        const transaction = await TransactionService.getTransaction(reference as string);

        return sendSuccess({
            res,
            data: transaction,
            message: "Transaction retrieved successfully"
        });
    });
}