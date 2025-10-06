<script lang="ts" setup>
import { computed } from 'vue'
import { CardFooter } from '@/components/ui/card'

import type { ProductApi } from '@/types/Product'

// import { useCartStore } from '@/store/CartStore'
import { useProductModel } from '@/composables/useProductModel'

// const cartStore = useCartStore()

const props = defineProps<{
  product: ProductApi
}>()

const { product: modelProduct } = useProductModel(props.product)
</script>
<template>
  <CardFooter>
    <div class="grid auto-cols-max grid-flow-col group-quantity mr-10">
      <p>
        Quantité :
        <span class="nb-quantity">{{ product.quantity }}</span>
        <span class="sr-only"> {{ product.quantity! > 1 ? 'articles' : 'article' }}</span>
      </p>
    </div>
  </CardFooter>
</template>
