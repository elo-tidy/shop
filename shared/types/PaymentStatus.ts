import { z } from "zod";

export const paymentStatusEnumSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export type paymentStatusEnum = z.infer<typeof paymentStatusEnumSchema>;
