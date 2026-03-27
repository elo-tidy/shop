import { defineStore } from 'pinia'
import { ref, computed, toRefs } from 'vue'
// Types
import type { productCatalog } from '@/types/Product'
import type {CartType} from '@/types/Cart'
//  Models
import { Cart } from '@/models/Cart'
// Stores
import { usecheckoutStepper } from './OrderStepperStore'
// Utils
import {
  formatPriceWithTwoDecimals,
  priceFromEurosToCents,
  numberWithTwoDecimals,
} from '@/utils/maths'

export const useCartStore = defineStore(
  'cart',
  () => {
    // State
    const cart = ref<CartType>(
      new Cart({
        id: '',
        // status: null,
        products: [],
      }),
    )

    // Actions
    function addToCart(product: productCatalog, itemQuantity: number) {
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
