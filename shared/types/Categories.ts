import { z } from "zod";

export const categoryEnum = z.enum([
  "electronics",
  "jewelery",
  "mens clothing",
  "womens clothing",
]);
export type Category = z.infer<typeof categoryEnum>;
