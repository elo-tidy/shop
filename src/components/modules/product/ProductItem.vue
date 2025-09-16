<script lang="ts" setup>
import { computed, onMounted, ref, defineComponent, h, markRaw } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import ProductTitle from '@/components/modules/product/ProductTitle.vue'
import { useCartStore } from '@/store/CartStore'
import { useProductModel } from '@/composables/useProductModel'
import type { ProductApi } from '@/types/Product'
import { toast } from 'vue-sonner'
import { useProductStore } from '@/store/ProductStore'
const cartStore = useCartStore()
const productStore = useProductStore()

// Products data
const props = defineProps<{
  product: ProductApi
  layout?: 'detail' | 'cart'
}>()
const { product, formattedPrice, shortTitle, shortDesc, imageAlt } = useProductModel(props.product)

const productContent = computed(() => {
  return props.layout === 'detail'
    ? {
        productDescription: product.value.description,
        productTitle: product.value.title,
      }
    : {
        productDescription: product.value.shortDesc,
        productTitle: product.value.shortTitle,
      }
})
const productQuantity = computed(() => {
  const item = cartStore.cart.products.find((p) => p.id === product.value.id)
  return item ? item.quantity : 0
})

// Layout
const hn = props.layout === 'detail' ? 1 : undefined

// Shopping cart actions

const addThisProductToCart = (product: ProductApi, quantity: number) => {
  cartStore.addToCart(product, quantity)
  cartStore.getCartTotaLItems
  toast(markRaw(customToast))
}

const deleteThisProductfromCart = (productId: number) => {
  cartStore.deleteFromCart(productId)
}

const updateItemQuantity = (productId: number, addOrRemove: string) => {
  cartStore.updateItemQuantity(productId, addOrRemove)
}

const customToast = defineComponent({
  setup() {
    return () =>
      h('div', { class: 'grid' }, [
        h('p', 'Le produit a été ajouté au panier.'),
        h('p', `Vous avez ${cartStore.getCartTotaLItems} article(s) dans votre panier.`),
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
  <Card v-if="product" :class="['py-0 relative card', props.layout]">
    <CardHeader class="px-6">
      <ProductTitle :hn="hn">
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">{{
          productContent.productTitle
        }}</RouterLink>
      </ProductTitle>
      <CardDescription class="price text-primary">{{ formattedPrice }}</CardDescription>
    </CardHeader>

    <img :src="product.image" :alt="imageAlt" class="object-contain img" />

    <CardContent v-if="props.layout !== 'cart'" class="h-full">
      {{ productContent.productDescription }}
    </CardContent>

    <CardFooter v-if="props.layout !== 'cart'" class="card-footer flex jpx-6 pb-6 justify-end-safe">
      <Button type="button" @click="addThisProductToCart(product, 1)"
        >Ajouter au panier <span class="sr-only">le produit {{ product.title }}</span></Button
      >
    </CardFooter>
    <CardFooter v-else>
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
            >{{ productQuantity }}</span
          >
          <span class="sr-only"> {{ productQuantity > 1 ? 'articles' : 'article' }}</span>
        </p>
        <Button
          v-if="productQuantity === 1"
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
      <Button
        class="delete-item ml-10"
        variant="link"
        type="button"
        @click="deleteThisProductfromCart(product.id)"
        >Supprimer <span class="sr-only">le produit {{ product.title }}</span></Button
      >
    </CardFooter>
  </Card>
</template>
<style lang="css" scoped>
@import '@/assets/styles/productCard.css';
</style>
