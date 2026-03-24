import type { ProductApi } from '@/typesold/Product'
import type { Database, Tables } from './supabase'

type SupabaseCartRow = Database['public']['Tables']['carts']['Insert']
export interface CartType extends SupabaseCartRow {
  // cart_id?: string | null
  // products: InsertCartProduct[]
  products: ProductApi[]
  // status: string | null
}

/*export interface InsertCartProduct {
  cart_id: string
  product_id: number
  title: string
  price: number
  description: string
  image: string
  category: string
  quantity: number
}*/

type SupabaseCartProductInsert = Database['public']['Tables']['carts_products']['Insert']
export interface InsertCartProduct extends SupabaseCartProductInsert {}

export interface Cart {
  id: string
  carts_products: InsertCartProduct[]
}

/*export interface Order {
  id: string
  user_id: string
  cart_id: string
  total_price: number
  payment_status: number
  payment_method: string
  created_at: string
  updated_at: string | null
  delivery_status: number
  delivery_price: number
  delivery_carrier: string
  delivery_date: Date | string
  delivery_day?: string
  products_price: number
  payment_ID: string | null
  // carts: Cart
  carts: Cart
}*/

type SupabaseOrderInsert = Database['public']['Tables']['orders']['Insert']
export interface Order extends SupabaseOrderInsert {
  carts: Cart
}
