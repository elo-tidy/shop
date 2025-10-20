import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Cart } from '@/models/Cart'
import type { ProductApi } from '@/types/Product'

export const useCartStore = defineStore(
  'cart',
  () => {
    // State
    const cart = ref<Cart>(
      new Cart({
        cart_id: null,
        status: null,
        products: [],
      }),
    )

    // Actions
    function addToCart(product: ProductApi, itemQuantity: number) {
      cart.value.addItemToCart(product, itemQuantity)
    }

    function deleteFromCart(productId: number) {
      cart.value.deleteItemFromCart(productId)
    }

    function updateItemQuantity(productId: number, addOrRemove: string) {
      cart.value.updateItemQuantity(productId, addOrRemove)
    }

    function clearCartStore() {
      cart.value.deleteItemsFromCart()
    }

    // Getters
    const getCartTotalItems = computed(() => cart.value.totalNumberOfItem)
    const getCartTotalPrice = computed(() =>
      Number((Math.floor(cart.value.totalPrice * 100) / 100).toFixed(2)),
    )
    const getCartTotalPriceInCents = computed(() =>
      Number(Math.floor(cart.value.totalPrice * 100).toFixed(2)),
    )

    return {
      cart,
      addToCart,
      deleteFromCart,
      updateItemQuantity,
      clearCartStore,
      getCartTotalItems,
      getCartTotalPrice,
      getCartTotalPriceInCents,
    }
  },
  {
    persist: true,
  },
)
