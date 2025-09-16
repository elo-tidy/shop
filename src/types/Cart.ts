import type { ProductApi } from '@/types/Product'

export interface ProductWithQuantity extends ProductApi {
  quantity: number
}

export interface CartType {
  products: ProductWithQuantity[]
}
