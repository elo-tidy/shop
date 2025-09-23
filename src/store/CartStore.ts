import { defineStore } from 'pinia'
import { Cart } from '../models/Cart'
import type { CartType } from '@/types/Cart'
import type { Product } from '@/models/Product'
import type { ProductApi } from '@/types/Product'

export const useCartStore = defineStore('cart', {
  state: (): { cart: Cart } => ({
    cart: new Cart({
      cart_id: null,
      status: null,
      products: [],
    }),
  }),
  persist: true,
  actions: {
    addToCart(product: ProductApi, itemQuantity: number) {
      this.cart.addItemToCart(product, itemQuantity)
    },
    deleteFromCart(productId: number) {
      this.cart.deleteItemFromCart(productId)
    },
    updateItemQuantity(productId: number, addOrRemove: string) {
      this.cart.updateItemQuantity(productId, addOrRemove)
    },
    clearCartStore() {
      this.cart.deleteItemsFromCart()
    },
  },
  getters: {
    getCartTotaLItems: (state) => {
      return state.cart.totalNumberOfItem
    },
    getCartTotalPrice: (state) => {
      return state.cart.totalPrice
    },
  },
})
