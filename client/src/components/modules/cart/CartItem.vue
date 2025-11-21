<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// Types
import type { ProductApi } from '@/types/Product'
// Components
import ProductItem from '@/components/modules/product/ProductItem.vue'
// Composables
import { useSupabaseSession } from '@/composables/useSupabaseSession'
import { useCartDetails } from '@/composables/useCartDetails'
import { useOrderProcess } from '@/composables/useOrderProcess'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  products?: ProductApi[]
  layout?: 'cart' | 'check'
  productOnly?: true
}>()

/**
 * Data : global - layout - order - cart - wording
 */

// Global data
const route = useRoute()
const stepStore = usecheckoutStepper()

// Layout
const layout = computed(() => props.layout ?? 'cart')
const displayProductOnly = computed(() => !!props.productOnly)

// Order
const { effectiveOrder } = useOrderProcess()
const products = computed<ProductApi[]>(() => {
  if (props.products?.length) return props.products

  const carts = effectiveOrder.value?.carts
  if (!carts || carts.length === 0) return []

  const firstCart = Array.isArray(carts) ? carts[0] : carts
  if (!firstCart?.carts_products || firstCart.carts_products.length === 0) return []

  return firstCart.carts_products.map((p) => ({
    id: p.product_id,
    title: p.title,
    price: p.price,
    description: p.description ?? '',
    image: p.image,
    category: p.category,
    quantity: p.quantity ?? 1,
  }))
})

// Cart
const { totalNumberOfItem, wordingTotalNumberOfItem } = useCartDetails()

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
  <div v-if="products.length" class="shoping-cart">
    <ul :class="['grid', layout !== 'check' ? 'border bg-background' : 'border-b']">
      <li class="not-first:border-t p-5" v-for="item in products" :key="item.id">
        <productItem :product="item" :layout="layout" />
      </li>
    </ul>

    <div v-if="!displayProductOnly" class="text-right">
      <p class="total grid grid-cols-[1fr_80px] place-items-end auto-cols-auto border-b p-2">
        <span>Sous-total ({{ totalNumberOfItem }} {{ wordingTotalNumberOfItem }}) :</span>
        <span class="text-right tabular-nums font-mono">{{ effectiveOrder.products_price }} €</span>
      </p>

      <template v-if="stepStore && layout === 'check'">
        <p class="total grid grid-cols-[1fr_80px] place-items-end border-b p-2">
          <span>Frais de livraison :</span>
          <span class="text-right tabular-nums font-mono">
            {{ effectiveOrder.delivery_price }} €
          </span>
        </p>
        <p class="total text-primary grid grid-cols-[1fr_80px] place-items-end border-b p-2">
          <span>Total :</span>
          <span class="text-right tabular-nums font-mono">
            {{ effectiveOrder.total_price }} €
          </span>
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
