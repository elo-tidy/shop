import { z } from "https://esm.sh/zod@4.1.11";

export const paymentStatusEnumSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export type paymentStatusEnum = z.infer<typeof paymentStatusEnumSchema>;
