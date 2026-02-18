import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});

export const toggleServiceSchema = z.object({
  params: z.object({
    serviceType: z.string()
  }),
  body: z.object({
    enabled: z.boolean()
  })
});

export const updateRateSchema = z.object({
  body: z.object({
    rate: z.number().positive("Rate must be positive")
  })
});

export const retryFulfillmentSchema = z.object({
  params: z.object({
    reference: z.string()
  })
});