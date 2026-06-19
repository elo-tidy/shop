import { z } from "zod";

export const ResolvePaymentIntentInputSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  paymentIntentId: z.string().optional(),
  metadata: z.object({
    orderId: z.string().nullable(),
    cartId: z.string().nullable(),
    userId: z.string(),
  }),
});
export type ResolvePaymentIntentInput = z.infer<
  typeof ResolvePaymentIntentInputSchema
>;

export const ResolvePaymentIntentResponseSchema = z.object({
  clientSecret: z.string(),
  paymentIntentId: z.string(),
});
export type ResolvePaymentIntentResponse = z.infer<
  typeof ResolvePaymentIntentResponseSchema
>;
