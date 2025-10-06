import { computed } from 'vue'
import { Cart as CartModel } from '@/models/Cart'
import type { CartType } from '@/types/Cart'

export function useCartModel(cartData: CartType) {
  const cart = computed(() => new CartModel(cartData))

  const products = computed(() => cart.value.products)
  const cart_id = computed(() => cart.value.cart_id)
  const status = computed(() => cart.value.status)
  const totalNumberOfItem = computed(() => cart.value.totalNumberOfItem)
  const wordingTotalNumberOfItem = computed(() =>
    cart.value.totalNumberOfItem === 1 ? 'article' : 'articles',
  )
  const orderPrice = computed(() => cart.value.totalPrice)

  return {
    cart,
    products,
    cart_id,
    status,
    totalNumberOfItem,
    orderPrice,
    wordingTotalNumberOfItem,
  }
}
