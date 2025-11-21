import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Cart } from '@/models/Cart'
import { usecheckoutStepper } from './OrderStepperStore'
import type { ProductApi } from '@/types/Product'
import {
  formatPriceWithTwoDecimals,
  priceFromEurosToCents,
  numberWithTwoDecimals,
} from '@/utils/maths'

export const useCartStore = defineStore(
  'cart',
  () => {
    // State
    const cart = ref<Cart>(
      new Cart({
        cart_id: null,
        // status: null,
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
    const getCartTotalPrice = computed(() => {
      return formatPriceWithTwoDecimals(cart.value.totalPrice)
    })
    const getCartTotalPriceInCents = computed(() => priceFromEurosToCents(cart.value.totalPrice))

    const getShippingPrice = computed((): string => {
      const stepStore = usecheckoutStepper()
      const price = stepStore.getLivraisonDetails?.transporter.price ?? 0
      return numberWithTwoDecimals(price)
    })
    const getOrderPrice = computed(() => {
      const cartPrice = Number(getCartTotalPrice.value)
      const shipping = Number(getShippingPrice.value)
      const price = cartPrice + shipping
      return formatPriceWithTwoDecimals(price)
    })

    return {
      cart,
      addToCart,
      deleteFromCart,
      updateItemQuantity,
      clearCartStore,
      getCartTotalItems,
      getCartTotalPrice,
      getCartTotalPriceInCents,
      getShippingPrice,
      getOrderPrice,
    }
  },
  {
    persist: true,
  },
)
