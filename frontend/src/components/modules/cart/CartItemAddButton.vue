<script lang="ts" setup>
import { defineComponent, h, markRaw } from 'vue'
// Types
import type { ProductApi } from '@/types/Product'
// Ui
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { toast } from 'vue-sonner'
// Composables
import { useCartDetails } from '@/composables/useCartDetails'
// Stores
import { useCartStore } from '@/store/CartStore'

// Props
const props = defineProps<{
  product: ProductApi
  layout?: 'detail' | 'cart' | 'check'
}>()

/**
 * Data : add to cart - notification when adding item -
 */

const { wordingTotalNumberOfItem } = useCartDetails()
const cartStore = useCartStore()

// Add product to cart
const addThisProductToCart = (product: ProductApi, quantity: number) => {
  cartStore.addToCart(product, quantity)
  cartStore.getCartTotalItems
  toast(markRaw(customToast))
}

// Notify user that item has been added to cart
const customToast = defineComponent({
  setup() {
    return () =>
      h('div', { class: 'grid' }, [
        h('p', 'Le produit a été ajouté au panier.'),
        h(
          'p',
          `Vous avez ${cartStore.getCartTotalItems} ${wordingTotalNumberOfItem.value} dans votre panier.`,
        ),
        h('div', {
          innerHTML:
            '<Button type="button" class="bg-primary text-background px-3 py-1 ">Voir le panier</Button>',
          class: 'mt-2 justify-end grid',
          onClick: () => {
            window.location.href = '/cart'
          },
        }),
      ])
  },
})
</script>
<template>
  <CardFooter class="card-footer flex jpx-6 pb-6 justify-end-safe">
    <Button type="button" @click="addThisProductToCart(product, 1)"
      >Ajouter au panier <span class="sr-only">le produit {{ product.title }}</span></Button
    >
  </CardFooter>
</template>
