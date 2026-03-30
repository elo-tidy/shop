import { z } from "https://esm.sh/zod@4.1.11";
import {categoryEnum} from '@/types/Categories'
import {productCatalogSchema} from '@/types/Product'

// Product Base
const productBaseSchema = z.object({
  title: z.string(),
  price: z.number(),
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
  carts_products: z.array(cartProductSchema),
})
export type Cart = z.infer<typeof cartSchema>

// Frontend Cart
export const cartTypeSchema = z.object({
  id: z.string().optional(),
  products: z.array(productCatalogSchema),
})
export type CartType = z.infer<typeof cartTypeSchema>

//  Order
export const orderSchema = z.object({
  id: z.string().optional(),

  cart_id: z.string().optional(),
  user_id: z.string().optional(),

  total_price: z.number(),
  products_price: z.number(),

  payment_status: z.number(),
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