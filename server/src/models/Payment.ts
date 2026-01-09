// BCH payment

import mongoose, { Document, Schema } from 'mongoose';
import { IPayment, PaymentStatusEnum } from '@shared/types';

export interface IPaymentDocument extends Omit<IPayment, '_id' | 'transactionId' | 'createdAt' | 'updatedAt'>, Document {
    _id: mongoose.Types.ObjectId;
    transactionId: mongoose.Types.ObjectId;
}

const paymentSchema = new Schema<IPaymentDocument>({
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true, index: true },

    blockchain: { type: String, required: true, enum: ['BCH'] },
    address: { type: String, required: true },
    txHash: { type: String, default: null, index: true },

    amountBch: { type: Number, required: true },
    amountSats: { type: Number, required: true },
    confirmations: { type: Number, default: 0 },

    status: { type: String, required: true, enum: Object.values(PaymentStatusEnum), index: true },

    rawBlockchainPayload: { type: Schema.Types.Mixed },
}, {
    timestamps: true
});

export const PaymentModel = mongoose.model<IPaymentDocument>('Payment', paymentSchema); 