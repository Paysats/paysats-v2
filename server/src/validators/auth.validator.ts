import { z } from 'zod';

export const googleLoginSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, 'Google token is required')
      .trim(),
  }),
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
