<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// Types
import type { cartProduct } from '@shared/types/Cart'
// Components
import ProductItem from '@/components/modules/product/ProductItem.vue'
// Composables
import { useSupabaseSession } from '@/composables/useSupabaseSession'
import { useCartProcess } from '@/composables/useCartProcess'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { useOrderStore } from '@/store/OrderStore'
// Utils
import { numberWithTwoDecimals } from '@shared/utils/maths'

// Props
const props = withDefaults(
  defineProps<{
    products?: cartProduct[]
    hn?: 1 | 2 | 3 | 4
    layout?: 'cart' | 'check' | 'admin'
    productOnly?: true
  }>(),
  {
    layout: 'cart',
  },
)

/**
 * Data : global - layout - order - cart - wording
 */

// Global data
const route = useRoute()
const stepStore = usecheckoutStepper()
const cartStore = useCartStore()
const orderStore = useOrderStore()

// Layout
const displayProductOnly = computed(() => !!props.productOnly)

const deliveryPrice = computed(() =>
  !orderStore.isPaid
    ? numberWithTwoDecimals(orderStore.deliveryDetails?.transporter.price ?? 0)
    : numberWithTwoDecimals(orderStore.orderModel?.data.delivery_price ?? 0),
)

const productsPrice = computed(() => {
  return numberWithTwoDecimals(cartStore.cart.totalPrice)
})
const totalPrice = computed(() => {
  return numberWithTwoDecimals(Number(deliveryPrice.value ?? 0) + Number(productsPrice.value))
})

// Cart
const { wordingTotalNumberOfItem } = useCartProcess()
const products = computed(() => {
  return orderStore.isPaid ? orderStore.orderModel?.data.cart.products : cartStore.cart.products
})

// Wording and routing
const { session } = useSupabaseSession()
const cta = computed(() => {
  if (session.value?.user.aud === 'authenticated') {
    return {
      wording: 'Finaliser ma commande',
      link: { name: 'checkout' },
    }
  } else {
    return {
      wording: 'Valider mon panier',
      link: { name: 'auth', query: { history: 'order' } },
    }
  }
})
</script>

<template>
  <div v-if="products?.length" class="shoping-cart max-w-4xl">
    <ul class="grid border-t-0 border-b-0 gap-y-2">
      <li class="" v-for="item in products" :key="item.id">
        <productItem :product="item" :layout="props.layout" :hn="props.hn" />
      </li>
    </ul>

    <div v-if="!displayProductOnly" class="text-right">
      <p class="total grid grid-cols-[1fr_80px] place-items-end auto-cols-auto border-b p-2">
        <span>Sous-total ({{ cartStore.getCartTotalItems }} {{ wordingTotalNumberOfItem }}) :</span>
        <span class="text-right tabular-nums font-mono"> {{ productsPrice }} € </span>
      </p>

      <template v-if="stepStore && layout === 'check'">
        <p class="total grid grid-cols-[1fr_80px] place-items-end border-b p-2">
          <span>Frais de livraison :</span>
          <span class="text-right tabular-nums font-mono"> {{ deliveryPrice ?? '--' }} €</span>
        </p>
        <p class="total text-primary grid grid-cols-[1fr_80px] place-items-end border-b p-2">
          <span>Total :</span>
          <span class="text-right tabular-nums font-mono"> {{ totalPrice }} €</span>
        </p>
      </template>

      <p v-if="layout !== 'check' && route.name !== 'checkout'">
        <RouterLink :to="cta.link" id="order" class="btn">{{ cta.wording }}</RouterLink>
      </p>
    </div>
  </div>

  <div v-else class="empty-cart">
    <p>Votre panier est vide</p>
  </div>
</template>
