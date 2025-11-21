<script lang="ts" setup>
// Components
import { Badge } from '@/components/ui/badge'
// Stores
import { useCartDetails } from '@/composables/useCartDetails'
import { useCartStore } from '@/store/CartStore'

const cart = useCartStore()
const { wordingTotalNumberOfItem } = useCartDetails()
</script>
<template>
  <RouterLink to="/cart" class="btn-sidebar btn-cart border" aria-live="polite" aria-atomic="true">
    <span class="sr-only">Voir </span>
    Mon Panier
    <Badge as="span" class="p-0 bg-transparent text-inherit" v-if="cart.getCartTotalItems"
      >({{ cart.getCartTotalItems }} {{ wordingTotalNumberOfItem }})</Badge
    >
  </RouterLink>
</template>
