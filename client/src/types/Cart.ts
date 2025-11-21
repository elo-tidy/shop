import type { ProductApi } from '@/types/Product'

export interface CartType {
  cart_id?: number | null
  // products: InsertCartProduct[]
  products: ProductApi[]
  // status: string | null
}

export interface InsertCartProduct {
  cart_id: string
  product_id: number
  title: string
  price: number
  description: string
  image: string
  category: string
  quantity: number
}

export interface Cart {
  id: number
  carts_products: InsertCartProduct[]
}

export interface Order {
  id: number
  user_id: number
  cart_id: number
  total_price: number
  payment_status: number
  payment_method: string
  created_at: string
  updated_at: string
  delivery_status: number
  delivery_price: number
  delivery_carrier: string
  delivery_date: Date | string
  delivery_day?: string
  products_price: number
  // carts: Cart
  carts: Cart[]
}
