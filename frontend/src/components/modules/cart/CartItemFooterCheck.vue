<script lang="ts" setup>
import { computed } from 'vue'
// Types
import { type productCatalog } from '@/types/Product'
// Ui
import { CardFooter } from '@/components/ui/card'
// Composables
import { useCartDetails } from '@/composables/useCartDetails'
import { useProductModel } from '@/composables/useProductModel'
// Stores
import { useCartStore } from '@/store/CartStore'

// Props
const props = defineProps<{
  product: productCatalog
}>()

/**
 * Data
 */

const cartStore = useCartStore()
const { cartData } = useCartDetails()

// Products of effective order (bdd first - store then)
const storeProduct = computed(
  () =>
    cartData.value?.products.find((p) => p.id === props.product.id) ||
    cartStore.cart.products.find((p) => p.id === props.product.id),
)
const { product } = useProductModel(storeProduct)
</script>
<template>
  <CardFooter>
    <div class="grid auto-cols-max grid-flow-col group-quantity mr-10">
      <p>
        Quantité :
        <span class="nb-quantity">{{ props.product?.quantity }}</span>
        <span class="sr-only"> {{ props.product?.quantity > 1 ? 'articles' : 'article' }}</span>
      </p>
    </div>
  </CardFooter>
</template>
