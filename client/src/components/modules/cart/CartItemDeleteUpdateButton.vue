<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { ProductApi } from '@/types/Product'
// Ui
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Composables
import { useProductModel } from '@/composables/useProductModel'
import { useCartDetails } from '@/composables/useCartDetails'
// Stores
import { useCartStore } from '@/store/CartStore'

// Props
const props = defineProps<{
  product: ProductApi
  layout?: 'detail' | 'cart' | 'check'
}>()

/**
 * Data :
 */

const cartStore = useCartStore()
const { cartData } = useCartDetails()

// Products from bdd first, from store then
const storeProduct = computed(() => {
  const prod =
    cartData.value?.products.find((p) => p.id === props.product?.id) ||
    cartStore.cart.products.find((p) => p.id === props.product?.id)

  if (!prod) return undefined

  return {
    id: prod.id,
    title: prod.title,
    price: prod.price,
    description: prod.description,
    image: prod.image,
    category: prod.category,
    quantity: prod.quantity,
  }
})
const { product } = useProductModel(storeProduct)

// Delete from cart
const deleteThisProductfromCart = (productId: number) => {
  console.log('delete')
  cartStore.deleteFromCart(productId)
}

// Update item quantity
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
          :id="`item-quantity-id${product?.id}`"
          aria-live="polite"
          aria-atomic="true"
          >{{ product?.itemQuantity }}</span
        >
        <span class="sr-only"> {{ product?.itemQuantity! > 1 ? 'articles' : 'article' }}</span>
      </p>

      <!-- Less quantity or delete if 1 -->
      <Button
        v-if="product?.itemQuantity === 1"
        class="delete-item remove-quantity"
        type="button"
        title="Supprimer l'article"
        @click="deleteThisProductfromCart(product?.id)"
        :aria-controls="`item-delete-${product?.id}`"
      >
        <span class="sr-only">Supprimer l'article {{ product?.title }}</span>
      </Button>
      <Button
        v-else
        class="remove-quantity"
        type="button"
        title="Diminuer la quantité de 1"
        :aria-controls="`item-quantity-id${product?.id}`"
        @click="updateItemQuantity(product?.id!, 'remove')"
      >
        <span class="sr-only">Diminuer la quantité de 1</span>-
      </Button>

      <!-- Add quantity -->
      <Button
        class="add-quantity"
        type="button"
        title="Augmenter la quantité de 1"
        :aria-controls="`item-quantity-id${product?.id}`"
        @click="updateItemQuantity(product?.id!, 'add')"
      >
        <span class="sr-only">Augmenter la quantité de 1</span>+
      </Button>
    </div>

    <!-- Delete item -->
    <Button
      class="delete-item ml-10"
      variant="link"
      type="button"
      @click="deleteThisProductfromCart(product?.id!)"
      >Supprimer <span class="sr-only">le produit {{ product?.title }}</span></Button
    >
  </CardFooter>
</template>
