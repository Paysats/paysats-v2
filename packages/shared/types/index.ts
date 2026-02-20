/**
 * Shared types used across client and server
 * These are clean domain models without database-specific fields
 */

export enum UserRoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}



export enum ServiceTypeEnum {
  AIRTIME = 'airtime',
  DATA = 'data',
  CABLE_TV = 'cable_tv',
  ELECTRICITY = 'electricity',
  HOTEL_BOOKING = 'hotel_booking',
  FLIGHT_BOOKING = 'flight_booking',
}

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface IPayment {
  _id: string
  transactionId: string

  blockchain: "BCH"
  address: string
  txHash?: string

  amountBch: number
  amountSats: number
  confirmations: number

  status: PaymentStatusEnum

  rawBlockchainPayload: object   // from mainnet.cash, prompt.cash

  createdAt: Date
  updatedAt: Date
}


export enum InvoiceStatusEnum {
  CREATED = "CREATED",
  PAID = "PAID",
  FULFILLING = "FULFILLING",
  FULFILLED = "FULFILLED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED"
}

export interface IInvoice {
  _id: string;
  serviceType: ServiceTypeEnum;
  serviceMeta: {
    phone: string
    network: string
    planCode?: string
  };

  amount: {
    ngn: number // amount in NGN
    bch: number // amount in BCH at time of invoice creation
    rate: number // exchange rate at time of invoice creation
  }
  status: InvoiceStatusEnum;
  metaData: Record<string, any>; // phone number, network, airtime, plan etc...

  createdAt: Date;
  updatedAt: Date;

  paidAt?: Date | null;
  fulfilledAt?: Date | null;
}


export enum FulfillmentStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IFulfillment {

  _id: string
  transactionId: string

  provider: "VTPASS" | "PAYSCRIBE"
  serviceType: ServiceTypeEnum

  providerTransactionId: string   // VTpass transactionId
  providerRequestId: string       // VTpass requestId

  status: FulfillmentStatusEnum

  amount: {
    ngn: number
    commission: number
    totalCharged: number
  }

  response: {
    code: string
    description: string
  }

  meta: {
    productName: string
    phone: string
    network?: string
    channel: string
    platform: string
    method: string
  }

  rawResponse: object   // FULL VTpass payload (unchanged)

  createdAt: Date;
  updatedAt: Date;

}


export enum TransactionStatusEnum {
  INITIATED = 'INITIATED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUND_PENDING = 'REFUND_PENDING',
}

export interface ITransaction {
  _id: string;
  reference: string

  serviceType: ServiceTypeEnum
  provider: 'VTPASS' | 'PAYSCRIBE'

  amount: {
    ngn: number
    bch: number
    rate: number
  }

  serviceMeta: {
    phone: string
    network: string
    planCode?: string
  }

  paymentId: string | null

  fulfillmentId: string | null

  status: TransactionStatusEnum

  failureReason: string | null

  paidAt: Date | null
  fulfilledAt: Date | null

  createdAt: Date;
  updatedAt: Date;
}

export { NodeEnv } from './environment.types';