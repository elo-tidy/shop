<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { cartProduct } from '@shop/shared/types/Cart'
// Ui
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
// Composables
import { useCartProcess } from '@/composables/useCartProcess'
// Store
import { useCartStore } from '@/store/CartStore'

// Props
const props = defineProps<{
  product: cartProduct
  layout?: 'detail' | 'cart' | 'check'
}>()

// Add product to cart
const { addThisProductToCart, limitUpdateQty } = useCartProcess()

// Store
const cartStore = useCartStore()
const quantityInCart = computed(() => cartStore.getItemQuantity(props.product.id))
</script>
<template>
  <CardFooter
    :class="[
      'card-footer flex flex-col justify-end-safe items-end mb-5 text-right',
      layout === 'detail' ? 'mb-0' : 'mb-5',
    ]"
  >
    <Button
      type="button"
      @click="addThisProductToCart(product, 1)"
      :disabled="limitUpdateQty(product.id, 'add')"
      >Ajouter au panier <span class="sr-only">le produit {{ product.title }}</span></Button
    >
    <p v-if="quantityInCart > 0" class="text-xs mt-2">
      {{ quantityInCart }}
      {{ quantityInCart > 1 ? 'articles' : 'article' }}
      dans votre panier
      <span v-if="limitUpdateQty(product.id, 'add')"> - Stock disponible épuisé</span>
    </p>
  </CardFooter>
</template>
