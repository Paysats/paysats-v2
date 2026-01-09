import { NetworkProviderEnum } from "@shared/types/network-provider.types";
import { z } from "zod";

const purchaseAirtimeSchema = z.object({
    body: z.object({
        phoneNumber: z.string().min(10).max(11),
        amount: z.number().min(50).max(50000),
        network: z.string().trim().refine((val) => Object.values(NetworkProviderEnum).includes(val as NetworkProviderEnum), {
            message: 'Invalid network provider',
        }),
    }),
});

export const PaymentValidator = {
    purchaseAirtime: purchaseAirtimeSchema,
};