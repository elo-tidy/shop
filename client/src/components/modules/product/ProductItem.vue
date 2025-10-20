<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import ProductItemFooterDefault from '@/components/modules/cart/CartItemAddButton.vue'
import CartItemFooter from '@/components/modules/cart/CartItemDeleteUpdateButton.vue'
import CartItemFooterCheck from '@/components/modules/cart/CartItemFooterCheck.vue'
import ProductTitle from '@/components/modules/product/ProductTitle.vue'

import type { ProductApi } from '@/types/Product'

import { useProductModel } from '@/composables/useProductModel'

// Props
const props = defineProps<{
  product: ProductApi
  layout?: 'detail' | 'cart' | 'check'
  cart_id?: string
  product_id?: number
}>()

// Layout
const layout = computed(() => {
  return props.layout ? props.layout : undefined
})

// Products data
const {
  product: modelProduct,
  formattedPrice,
  shortTitle,
  shortDesc,
  imageAlt,
  quantity,
} = useProductModel(props.product)

const hn: 1 | 4 | undefined =
  layout.value === 'detail' ? 1 : layout.value === 'check' ? 4 : undefined

const productTitleWrapper = computed(() => {
  return layout.value !== 'detail' && layout.value !== 'check' ? RouterLink : 'span'
})
const productTitleWrapperProps = computed(() => {
  return productTitleWrapper.value !== 'span' ? { to: `/product/${modelProduct.value.id}` } : null
})

const productContent = computed(() => {
  return layout.value === 'detail'
    ? {
        productDescription: modelProduct.value.description,
        productTitle: modelProduct.value.title,
      }
    : {
        productDescription: modelProduct.value.shortDesc,
        productTitle: modelProduct.value.shortTitle,
      }
})

const productFooter = computed(() => {
  switch (layout.value) {
    case 'cart':
      return CartItemFooter
    case 'check':
      return CartItemFooterCheck
    default:
      return ProductItemFooterDefault
  }
})
</script>
<template>
  <Card
    v-if="product"
    :class="['py-0 relative card', layout, layout === 'check' ? 'gap-0' : 'gap-2']"
  >
    <CardHeader class="card-header">
      <ProductTitle :hn="hn">
        <component :is="productTitleWrapper" v-bind="productTitleWrapperProps">
          {{ productContent.productTitle }}
        </component>
      </ProductTitle>
      <CardDescription class="price text-primary">{{ formattedPrice }}</CardDescription>
    </CardHeader>

    <img :src="product.image" :alt="imageAlt" class="object-contain img" />

    <CardContent v-if="layout !== 'cart' && layout !== 'check'" class="h-full">
      {{ productContent.productDescription }}
    </CardContent>

    <component :is="productFooter" :layout :product></component>
  </Card>
</template>
<style lang="css">
@import '@/assets/styles/productCard.css';
</style>
