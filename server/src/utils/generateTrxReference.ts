import { randomUUID } from "crypto";

export function generateTransactionReference() {
    return `txn_${randomUUID()}`;
}
