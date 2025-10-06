<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
// Types
import type { ProductApi } from '@/types/Product'
import type { CartType } from '@/types/Cart'
// Components
import ProductItem from '@/components/modules/product/ProductItem.vue'
// Composables
import { useCartModel } from '@/composables/useCartModel'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
import { useLivraisonDetails } from '@/composables/useLivraisonDetails'
// Stores
import { useCartStore } from '@/store/CartStore'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Global data
const { session } = useSupabaseSession()
const route = useRoute()
const stepStore = usecheckoutStepper()
// Props
const props = defineProps<{
  cart: CartType
  layout?: 'cart' | 'check'
  productOnly?: true
}>()

// Data layout
const layout = computed(() => (props.layout ? props.layout : 'cart'))
// Data cart
const dataCart = computed(() => {
  return props.cart ? useCartModel(props.cart) : null
})
const cartStore = useCartStore()
const product_list = computed<ProductApi[]>(() =>
  props.cart?.products ? props.cart?.products : cartStore.cart.products,
)
const displayProductOnly = computed(() => {
  return props.productOnly ? true : null
})
const total = computed(() => {
  const orderPrice = dataCart.value?.orderPrice?.value ?? 0
  const shippingPrice = Number(stepStore.getLivraisonDetails?.transporter.price ?? 0)
  return orderPrice + shippingPrice
})
const shippingPrice = computed(() => {
  const price = stepStore.getLivraisonDetails?.transporter.price ?? 0
  return price.toFixed(2)
})
// Cta
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
  <div v-if="product_list.length" class="shoping-cart">
    <ul :class="['grid', layout !== 'check' ? 'border bg-background' : 'border-b']">
      <li class="not-first:border-t p-5" v-for="item in product_list" :key="item.id">
        <productItem :product="item" :layout="layout" />
      </li>
    </ul>
    <div v-if="!displayProductOnly" class="text-right">
      <p class="total grid grid-cols-[1fr_80px] place-items-end auto-cols-auto">
        <span
          >Sous-total ({{ dataCart?.totalNumberOfItem }} {{ dataCart?.wordingTotalNumberOfItem }})
          :</span
        >
        <span class="text-right tabular-nums font-mono">{{ dataCart?.orderPrice }} €</span>
      </p>
      <template v-if="stepStore && layout === 'check'">
        <p class="total grid grid-cols-[1fr_80px] place-items-end">
          <span>Frais de livraison :</span>
          <span class="text-right tabular-nums font-mono">{{ shippingPrice }} €</span>
        </p>
        <p v-if="total" class="total text-primary grid grid-cols-[1fr_80px] place-items-end">
          <span>Total :</span>
          <span class="text-right tabular-nums font-mono">{{ total }} €</span>
        </p>
      </template>

      <p v-if="layout !== 'check' && route.name !== 'checkout'">
        <RouterLink :to="cta.link" id="order" class="btn">{{ cta.wording }} </RouterLink>
      </p>
    </div>
  </div>
  <div v-else class="empty-cart">
    <p>Votre panier est vide</p>
  </div>
</template>
<style lang="css" scoped>
@import '@/assets/styles/cart.css';
</style>
