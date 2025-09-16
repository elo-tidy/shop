import { defineStore } from 'pinia'
import { Cart } from '../models/Cart'
import type { CartType } from '@/types/Cart'
import type { Product } from '@/models/Product'
import type { ProductApi } from '@/types/Product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: new Cart(),
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
  },
  getters: {
    getCartTotaLItems: (state) => {
      return state.cart.products?.reduce((totalItems, product) => {
        return totalItems + product.quantity
      }, 0)
    },
    getCartTotalPrice: (state) => {
      return state.cart.products?.reduce((totalPrice, product) => {
        return Math.round((totalPrice + product.quantity * product.price) * 100) / 100
      }, 0)
    },
  },
})
