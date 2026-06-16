<script lang="ts" setup>
// Components
import { Badge } from '@/components/ui/badge'
// Store
import { useCartStore } from '@/store/CartStore'
import { useOrderStore } from '@/store/OrderStore'
// Composables
import { useCartProcess } from '@/composables/useCartProcess'

const cart = useCartStore()
const orderStore = useOrderStore()
const { wordingTotalNumberOfItem } = useCartProcess()

const displayTotalNumberOfItem = (): boolean => {
  if (cart.getCartTotalItems > 0 && !orderStore.isPaid) return true
  return false
}
</script>
<template>
  <RouterLink to="/cart" class="btn-sidebar btn-cart border" aria-live="polite" aria-atomic="true">
    <span class="sr-only">Voir </span>
    Mon Panier
    <Badge as="span" class="p-0 bg-transparent text-inherit" v-if="displayTotalNumberOfItem()"
      >({{ cart.getCartTotalItems }} {{ wordingTotalNumberOfItem }})</Badge
    >
  </RouterLink>
</template>
