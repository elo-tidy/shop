<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { cartProduct } from '@shared/types/Cart'
import type { productCatalog } from '@shared/types/Product'
// Ui
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Composables
import { useCartProcess } from '@/composables/useCartProcess'

// Props
const props = defineProps<{
  product: productCatalog | cartProduct
  layout?: 'detail' | 'cart' | 'check'
}>()

/**
 * Data :
 */
const { deleteThisProductfromCart, updateItemQuantity, limitUpdateQty } = useCartProcess()
function isCartProduct(p: productCatalog | cartProduct): p is cartProduct {
  return 'quantity' in p
}
const product = computed(() => {
  return isCartProduct(props.product) ? props.product : null
})
</script>
<template>
  <CardFooter class="mt-6" v-if="product">
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
          >{{ product.quantity }}</span
        >
        <span class="sr-only"> {{ product.quantity > 1 ? 'articles' : 'article' }}</span>
      </p>

      <!-- Less quantity or delete if 1 -->
      <Button
        v-if="product.quantity === 1"
        class="delete-item remove-quantity btn-icon"
        type="button"
        title="Supprimer l'article"
        @click="deleteThisProductfromCart(product.id)"
        :aria-controls="`item-delete-${product.id}`"
      >
        <span class="sr-only">Supprimer l'article {{ product.title }}</span>
      </Button>
      <Button
        v-else
        class="remove-quantity btn-icon"
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
        :disabled="limitUpdateQty(product.id, 'add')"
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
