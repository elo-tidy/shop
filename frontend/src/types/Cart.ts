import { z } from "https://esm.sh/zod@4.1.11";
import {categoryEnum} from '../types/Categories.ts'
import {productCatalogSchema} from '../types/Product.ts'
import {paymentStatusEnumSchema} from '../types/PaymentStatus.ts'

// Product Base
const productBaseSchema = z.object({
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
  image: z.string(),
  category: categoryEnum,
  stock: z.number().min(0),
})

// Products in cart
export const cartProductSchema = productBaseSchema.extend({
  id: z.string().optional(),
  cart_id: z.string().optional(),
  product_id: z.number(), 
  quantity: z.number().min(1),  
  created_at: z.string().optional(),
})
export type CartProduct = z.infer<typeof cartProductSchema>

//  Cart
export const cartSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
  products: z.array(cartProductSchema),
})
export type Cart = z.infer<typeof cartSchema>

// Frontend Cart
export const cartTypeSchema = z.object({
  id: z.string().optional(),
  products: z.array(productBaseSchema),
})
export type CartType = z.infer<typeof cartTypeSchema>


// Backend Cart
export const productBackEndSchema = z.object({
  id:z.number().int().positive(),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  price: z.number().min(0, "Le prix doit être renseigné"),
  title: z.string().min(1, "Le titre doit être renseigné"),
  description: z.string().nullable(),
  image: z.string().url("URL invalide"),
  category: categoryEnum
})

export const cartTypeBackEndSchema = z.object({
  id: z.string().optional(),
  delivery_carrier_id: z.string().min(1, "Le nom du transporteur est obligatoire"),
  payment_intent_ID:z.string().min(1, "Le payment ID est obligatoire"),
  products: z.array(productBackEndSchema),
})
export type CartBackEndType = z.infer<typeof cartTypeBackEndSchema>

//  Order
export const orderSchema = z.object({
  id: z.string().optional(),

  cart_id: z.string().optional(),
  user_id: z.string().optional(),

  total_price: z.number(),
  products_price: z.number(),

  payment_status: paymentStatusEnumSchema,
  payment_method: z.string(),
  payment_ID: z.string().nullable().optional(),

  delivery_status: z.number().nullable().optional(),
  delivery_price: z.number(),
  delivery_carrier: z.string(),
  delivery_date: z.string(),

  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),

  carts: cartSchema,
})
export type Order = z.infer<typeof orderSchema>