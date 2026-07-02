<script lang="ts" setup>
// Types
import type { cartProduct } from '@shared/types/Cart'
// Ui
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
// Composables
import { useCartProcess } from '@/composables/useCartProcess'

// Props
const props = defineProps<{
  product: cartProduct
  layout?: 'detail' | 'cart' | 'check'
}>()

// Add product to cart
const { addThisProductToCart, limitUpdateQty } = useCartProcess()
</script>
<template>
  <CardFooter class="card-footer flex justify-end-safe items-end mb-6">
    <Button
      type="button"
      @click="addThisProductToCart(product, 1)"
      :disabled="limitUpdateQty(product.id, 'add')"
      >Ajouter au panier <span class="sr-only">le produit {{ product.title }}</span></Button
    >
  </CardFooter>
</template>
