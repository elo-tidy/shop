import type { CartType } from '@/types/Cart'
import type { ProductApi } from '@/types/Product'

export class Cart {
  products: CartType['products']
  cart_id: number | null
  status: string | null

  constructor(data: CartType) {
    this.products = data.products
    this.cart_id = data.cart_id ?? null
    this.status = data.status
  }

  addItemToCart(product: ProductApi, itemQuantity: number) {
    const existingProduct = this.products?.find((p) => p.id === product.id)
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity ?? 0) + itemQuantity
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
        product.quantity = (product.quantity ?? 0) + 1
      } else {
        product.quantity = Math.max((product.quantity ?? 0) - 1, 0)
      }
    }
  }

  deleteItemsFromCart() {
    this.products.splice(0)
  }

  get totalNumberOfItem(): number {
    return this.products?.reduce((totalItems, product) => {
      return totalItems + product.quantity!
    }, 0)
  }

  get totalPrice(): number {
    return this.products?.reduce((totalPrice, product) => {
      return Math.round((totalPrice + product.quantity! * product.price) * 100) / 100
    }, 0)
  }
}
