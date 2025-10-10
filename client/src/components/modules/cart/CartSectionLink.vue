<script lang="ts" setup>
// Components
import { Badge } from '@/components/ui/badge'
// Stores
import { useCartStore } from '@/store/CartStore'
import { useCartModel } from '@/composables/useCartModel'

const cartStore = useCartStore()
const { totalNumberOfItem, wordingTotalNumberOfItem } = useCartModel(cartStore.cart)
</script>
<template>
  <RouterLink to="/cart" class="btn-sidebar btn-cart border" aria-live="polite" aria-atomic="true">
    <span class="sr-only">Voir </span>
    Mon Panier
    <Badge as="span" class="p-0 bg-transparent text-inherit" v-if="totalNumberOfItem"
      >({{ totalNumberOfItem }} {{ wordingTotalNumberOfItem }})</Badge
    >
  </RouterLink>
</template>
