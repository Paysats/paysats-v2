import mongoose, { Document, Schema } from 'mongoose';
import { ITransaction, ServiceTypeEnum, TransactionStatusEnum } from '@shared/types';

export interface ITransactionDocument extends Omit<ITransaction, '_id' | 'paymentId' | 'fulfillmentId' | 'createdAt' | 'updatedAt'>, Document {
    _id: mongoose.Types.ObjectId;
    paymentId: mongoose.Types.ObjectId | null;
    fulfillmentId: mongoose.Types.ObjectId | null;
}

const transactionSchema = new Schema<ITransactionDocument>({
    reference: { type: String, required: true, unique: true, index: true },

    serviceType: { type: String, required: true, enum: Object.values(ServiceTypeEnum) },
    provider: { type: String, required: true, enum: ['VTPASS', 'PAYSCRIBE'] },

    amount: {
        ngn: { type: Number, required: true },
        bch: { type: Number, required: true },
        rate: { type: Number, required: true },
    },

    serviceMeta: {
        phone: { type: String, required: true },
        network: { type: String, required: true },
        planId: { type: String, default: null },
    },

    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },

    fulfillmentId: {
        type: Schema.Types.ObjectId,
        ref: "Fulfillment",
        default: null,
    },

    status: { type: String, required: true, enum: Object.values(TransactionStatusEnum), index: true },

    failureReason: { type: String, default: null },

    paidAt: { type: Date, default: null },
    fulfilledAt: { type: Date, default: null },

}, {
    timestamps: true
});

export const TransactionModel = mongoose.model<ITransactionDocument>('Transaction', transactionSchema); 