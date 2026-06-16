// import { z } from "https://esm.sh/zod@4.1.11";
import { z } from "zod";
import { categoryEnum } from "../types/Categories.ts";
import { productCatalogSchema } from "../types/Product.ts";
import { paymentStatusEnumSchema } from "../types/PaymentStatus.ts";

// Frontend

const cartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
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
export const orderSchema = z.object({
  id: z.string().optional(),

  cart_id: z.string().optional(),
  user_id: z.string().optional(),

  total_price: z.number(),
  products_price: z.number(),

  payment_status: paymentStatusEnumSchema,
  payment_method: z.string(),
  payment_ID: z.string().nullable().optional(),
  stripe_event_id: z.string().nullable().optional(),

  delivery_status: z.string().nullable().optional(),
  delivery_price: z.number(),
  delivery_carrier: z.string(),
  delivery_date: z.string(),

  created_at: z.string(),
  updated_at: z.string().nullable().optional(),

  cart: cartSchema,
});
export type Order = z.infer<typeof orderSchema>;

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
export const orderBackEndSchema = z.object({
  id: z.string(),

  cart_id: z.string(),
  user_id: z.string(),

  total_price: z.number(),
  products_price: z.number(),

  payment_status: paymentStatusEnumSchema,
  payment_method: z.string(),
  payment_ID: z.string().nullable(),
  stripe_event_id: z.string().nullable().optional(),

  delivery_status: z.string().nullable(),
  delivery_price: z.number(),
  delivery_carrier: z.string(),
  delivery_date: z.string(),

  created_at: z.string(),
  updated_at: z.string().nullable(),

  cart: z.object({
    id: z.string(),

    products: z.array(
      z.object({
        id: z.string(),

        cart_id: z.string(),
        product_id: z.number(),

        title: z.string().nullable(),
        price: z.number(),
        quantity: z.number(),

        description: z.string().nullable(),
        image: z.string().nullable(),
        category: z.string().nullable(),

        products: z
          .object({
            stock: z.object({
              quantity: z.number().nullable(),
            }),
          })
          .optional(),
      }),
    ),
  }),
});
export type OrderDb = z.infer<typeof orderBackEndSchema>;
