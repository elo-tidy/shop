import type { CartType } from '@/types/Cart'
import type { Product } from '@/models/Product'
import type { ProductApi } from '@/types/Product'

export class Cart {
  products: CartType['products']

  constructor(data?: Partial<CartType>) {
    this.products = data?.products ?? []
  }

  addItemToCart(product: ProductApi, itemQuantity: number) {
    const existingProduct = this.products?.find((p) => p.id === product.id)
    if (existingProduct) {
      existingProduct.quantity += itemQuantity
    } else {
      this.products?.push({ ...product, quantity: itemQuantity })
    }
  }

  deleteItemFromCart(productId: number) {
    this.products = this.products?.filter((p) => p.id !== productId)
  }

  updateItemQuantity(productId: number, addOrRemove: string) {
    const product = this.products?.find((p) => p.id === productId)
    if (product) {
      if (addOrRemove === 'add') {
        product.quantity++
      } else {
        product.quantity--
      }
    }
  }
}
