<script lang="ts" setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/CartStore'
import { useCartModel } from '@/composables/useCartModel'

const cartStore = useCartStore()
const { totalNumberOfItem, wordingTotalNumberOfItem } = useCartModel(cartStore.cart)
</script>
<template>
  <RouterLink
    to="/cart"
    class="btn-cart bg-primary text-background"
    aria-live="polite"
    aria-atomic="true"
  >
    <span class="sr-only">Voir </span>
    Mon Panier
    <Badge as="span" class="p-0" v-if="totalNumberOfItem"
      >({{ totalNumberOfItem }} {{ wordingTotalNumberOfItem }})</Badge
    >
  </RouterLink>
</template>
