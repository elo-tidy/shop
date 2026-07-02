import { z } from "zod";
import { categoryEnum } from "@shared/types/Categories.ts";

// Frontend

const cartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  description: z.string().nullable(),
  image: z.string(),
  category: categoryEnum,
  // stock: z.number().min(0),
});
export type cartProduct = z.infer<typeof cartProductSchema>;
export const cartSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
  products: z.array(cartProductSchema),
});
export type CartType = z.infer<typeof cartSchema>;

// Backend Cart
export const productBackEndSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  price: z.number().min(0, "Le prix doit être renseigné"),
  title: z.string().min(1, "Le titre doit être renseigné"),
  description: z.string().nullable(),
  image: z.string().url("URL invalide"),
  category: categoryEnum,
});
export const cartTypeBackEndSchema = z.object({
  id: z.string().optional(),
  delivery_carrier: z.string().min(1, "Le nom du transporteur est obligatoire"),
  payment_ID: z.string().min(1, "Le payment ID est obligatoire"),
  products: z.array(productBackEndSchema),
});
export type CartBackEndType = z.infer<typeof cartTypeBackEndSchema>;
