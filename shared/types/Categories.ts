import { z } from "https://esm.sh/zod@4.1.11";

export const categoryEnum = z.enum([
  "electronics",
  "jewelery",
  "mens clothing",
  "womens clothing"
])
export type Category = z.infer<typeof categoryEnum>