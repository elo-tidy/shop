import { computed, watchEffect, ref } from 'vue'
import { useCartStore } from '@/store/CartStore'
import { useOrderProcess } from '@/composables/useOrderProcess'
import { Cart as CartModel } from '@/models/Cart'
import type { CartType, Cart, InsertCartProduct } from '@/types/Cart'
import type { ProductApi } from '@/types/Product'

export function useCartDetails() {
  const { effectiveOrder } = useOrderProcess()
  const cartStore = useCartStore()

  const cartData = computed<CartType | null>(() => {
    const order = effectiveOrder.value

    if (!order || !order.carts) return cartStore.cart || null

    // carts peut être un objet ou un tableau
    const cartObj = Array.isArray(order.carts) ? order.carts[0] : order.carts

    if (!cartObj?.carts_products?.length) return cartStore.cart || null

    return {
      cart_id: cartObj.id ?? null,
      products: cartObj.carts_products.map((p: InsertCartProduct) => ({
        id: Number(p.product_id),
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image,
        category: p.category,
        quantity: p.quantity,
      })),
    }
  })

  const cartModel = computed(() => (cartData.value ? new CartModel(cartData.value) : null))
  const products = computed(() => cartModel.value?.products ?? [])
  const totalNumberOfItem = computed(() => cartModel.value?.totalNumberOfItem ?? 0)
  const wordingTotalNumberOfItem = computed(() =>
    cartModel.value?.totalNumberOfItem === 1 ? 'article' : 'articles',
  )
  const orderPrice = computed(() => cartModel.value?.totalPrice ?? 0)

  return {
    cartData,
    cartModel,
    products,
    totalNumberOfItem,
    wordingTotalNumberOfItem,
    orderPrice,
  }
}
