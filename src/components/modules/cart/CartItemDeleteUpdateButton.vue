<script lang="ts" setup>
import { computed } from 'vue'
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import type { ProductApi } from '@/types/Product'

import { useCartStore } from '@/store/CartStore'
import { useProductModel } from '@/composables/useProductModel'

const cartStore = useCartStore()

const props = defineProps<{
  product: ProductApi
  layout?: 'detail' | 'cart' | 'check'
}>()

const { product } = useProductModel(props.product)

// Shopping cart actions
const deleteThisProductfromCart = (productId: number) => {
  cartStore.deleteFromCart(productId)
}

const updateItemQuantity = (productId: number, addOrRemove: string) => {
  cartStore.updateItemQuantity(productId, addOrRemove)
}
</script>
<template>
  <CardFooter>
    <div
      class="grid auto-cols-max grid-flow-col group-quantity mr-10"
      role="group"
      aria-label="Gestion de la quantité"
    >
      <p>
        Quantité :
        <span
          class="nb-quantity"
          :id="`item-quantity-id${product.id}`"
          aria-live="polite"
          aria-atomic="true"
          >{{ product.itemQuantity }}</span
        >
        <span class="sr-only"> {{ product.itemQuantity > 1 ? 'articles' : 'article' }}</span>
      </p>

      <!-- Less quantity or delete if 1 -->
      <Button
        v-if="product.itemQuantity === 1"
        class="delete-item remove-quantity"
        type="button"
        title="Supprimer l'article"
        @click="deleteThisProductfromCart(product.id)"
        :aria-controls="`item-delete-${product.id}`"
      >
        <span class="sr-only">Supprimer l'article {{ product.title }}</span>
      </Button>
      <Button
        v-else
        class="remove-quantity"
        type="button"
        title="Diminuer la quantité de 1"
        :aria-controls="`item-quantity-id${product.id}`"
        @click="updateItemQuantity(product.id, 'remove')"
      >
        <span class="sr-only">Diminuer la quantité de 1</span>-
      </Button>

      <!-- Add quantity -->
      <Button
        class="add-quantity"
        type="button"
        title="Augmenter la quantité de 1"
        :aria-controls="`item-quantity-id${product.id}`"
        @click="updateItemQuantity(product.id, 'add')"
      >
        <span class="sr-only">Augmenter la quantité de 1</span>+
      </Button>
    </div>

    <!-- Delete item -->
    <Button
      class="delete-item ml-10"
      variant="link"
      type="button"
      @click="deleteThisProductfromCart(product.id)"
      >Supprimer <span class="sr-only">le produit {{ product.title }}</span></Button
    >
  </CardFooter>
</template>
