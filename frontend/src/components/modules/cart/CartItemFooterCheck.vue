<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { cartProduct } from '@shared/types/Cart'
import type { productCatalog } from '@shared/types/Product'
// Ui
import { CardFooter } from '@/components/ui/card'

// Props
const props = defineProps<{
  product: cartProduct | productCatalog
}>()

/**
 * Data
 */
function isCartProduct(p: productCatalog | cartProduct): p is cartProduct {
  return 'quantity' in p
}
const cartProduct = computed(() => (isCartProduct(props.product) ? props.product : null))
</script>
<template>
  <CardFooter v-if="cartProduct">
    <div class="grid auto-cols-max grid-flow-col group-quantity mr-10">
      <p>
        Quantité :
        <span class="nb-quantity">{{ cartProduct.quantity }}</span>
        <span class="sr-only"> {{ cartProduct.quantity > 1 ? 'articles' : 'article' }}</span>
      </p>
    </div>
  </CardFooter>
</template>
