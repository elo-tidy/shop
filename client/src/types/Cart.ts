import type { ProductApi } from '@/types/Product'

export interface CartType {
  cart_id?: number | null
  products: ProductApi[]
  status: string | null
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
