<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import ProductTitle from '@/components/modules/product/ProductTitle.vue'
import { useCartStore } from '@/store/CartStore'
import { useProductModel } from '@/composables/useProductModel'
import type { ProductApi } from '@/types/Product'

const cartStore = useCartStore()

const props = defineProps<{
  product: ProductApi
  layout?: 'detail'
}>()

const { product, formattedPrice, shortTitle, shortDesc, imageAlt } = useProductModel(props.product)

const hn = props.layout === 'detail' ? 1 : undefined

const productContent = computed(() => {
  return props.layout === 'detail'
    ? {
        productDescription: product.description,
        productTitle: product.title,
      }
    : {
        productDescription: product.shortDesc,
        productTitle: product.shortTitle,
      }
})
const addThisProductToCart = (product: ProductApi, quantity: number) => {
  cartStore.addToCart(product, quantity)
  console.log('Product added to cart:', product, 'Quantity:', quantity)
}
</script>
<template>
  <Card
    v-if="product"
    :class="[
      'py-0 relative card',
      props.layout === 'detail' ? 'border-0 bg-transparent mt-10 pl-100 w-4xl' : null,
    ]"
  >
    <CardHeader :class="['px-6', props.layout === 'detail' ? '' : null]">
      <ProductTitle :hn="hn">
        <!-- <RouterLink :to="`/${product.id}`">{{ product.title }}</RouterLink> -->
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">{{
          productContent.productTitle
        }}</RouterLink>
      </ProductTitle>
      <CardDescription
        :class="[
          'text-primary',
          props.layout === 'detail' ? '' : 'absolute top-0 right-0 bg-background px-2 py-1',
        ]"
        >{{ formattedPrice }}</CardDescription
      >
    </CardHeader>
    <img
      :src="product.image"
      :alt="imageAlt"
      :class="[
        'object-contain',
        props.layout === 'detail'
          ? 'absolute top-0 left-0 w-100 h-[300px]'
          : 'order-first w-full h-[250px] min-h-[250px] p-4',
      ]"
    />
    <CardContent class="h-full">
      {{ productContent.productDescription }}
    </CardContent>
    <CardFooter
      :class="['flex jpx-6 pb-6 justify-end-safe', props.layout === 'detail' ? 'mt-10' : null]"
    >
      <Button type="button" @click="addThisProductToCart(product, 1)"
        >Ajouter au panier <span class="sr-only">le produit {{ product.title }}</span></Button
      >
    </CardFooter>
  </Card>
</template>
<style lang="css" scoped>
@import '@/assets/styles/productCard.css';
</style>
