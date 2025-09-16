<script lang="ts" setup>
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/CartStore'
import { computed } from 'vue'
const cartStore = useCartStore()
const totalItems = computed(() => cartStore.getCartTotaLItems)
const totalItemsText = computed(() => (totalItems.value > 1 ? 'articles' : 'article'))
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
    <Badge as="span" class="p-0" v-if="totalItems">({{ totalItems }} {{ totalItemsText }})</Badge>
  </RouterLink>
</template>
