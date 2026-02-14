// vtpass / providers payment fulfillment model

import mongoose, { Document } from 'mongoose';

import { IFulfillment, FulfillmentStatusEnum, ServiceTypeEnum } from '@shared/types';

export interface IFulfillmentDocument extends Omit<IFulfillment, '_id' | 'transactionId' | 'createdAt' | 'updatedAt'>, Document {
    _id: mongoose.Types.ObjectId;
    transactionId: mongoose.Types.ObjectId;
}

const fulfillmentSchema = new mongoose.Schema<IFulfillmentDocument>({
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true, index: true },

    provider: { type: String, required: true, enum: ['VTPASS', 'PAYSCRIBE'] },
    serviceType: { type: String, required: true, enum: Object.values(ServiceTypeEnum) },

    providerTransactionId: { type: String, required: false },
    providerRequestId: { type: String, required: false },

    status: { type: String, required: true, enum: Object.values(FulfillmentStatusEnum), index: true },

    amount: {
        ngn: { type: Number, required: true },
        commission: { type: Number, required: true },
        totalCharged: { type: Number, required: true },
    },

    response: {
        rawResponse: { type: mongoose.Schema.Types.Mixed, required: true },
    },
}, {
    timestamps: true
});

export const FulfillmentModel = mongoose.model<IFulfillmentDocument>("Fulfillment", fulfillmentSchema);