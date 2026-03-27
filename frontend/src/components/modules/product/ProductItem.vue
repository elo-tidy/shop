<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { RouterLink } from 'vue-router'
// Type
import type { productCatalog } from '@/types/Product'
// Ui
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
// Components
import ProductItemFooterDefault from '@/components/modules/cart/CartItemAddButton.vue'
import CartItemFooter from '@/components/modules/cart/CartItemDeleteUpdateButton.vue'
import CartItemFooterCheck from '@/components/modules/cart/CartItemFooterCheck.vue'
import ProductTitle from '@/components/modules/product/ProductTitle.vue'
import CartItemFooterAdmin from '@/components/modules/cart/CartItemFooterAdmin.vue'
// Composables
import { useProductModel } from '@/composables/useProductModel'

// Props
const props = withDefaults(
  defineProps<{
    product: productCatalog
    layout?: 'admin' | 'detail' | 'liste' | 'cart' | 'check'
    display?: 'grid' | 'card'
    hn?: 1 | 2 | 3 | 4
    cart_id?: string
    product_id?: number
    showItemId?: boolean
    displayFooter?: boolean
  }>(),
  {
    cart_id: '',
    product_id: 0,
    showItemId: false,
    displayFooter: true,
    // layout: 'liste',
    display: 'grid',
  },
)

/**
 * Data : layout
 */
// Class
const gridClass = props.display !== 'grid' ? '' : ' py-4'
const compLayout = computed(() =>
  props.display === 'grid' || props.display === undefined ? 'grid-tpl' : 'card-tpl',
)

// Layout
// const layout = computed(() => {
//   return props.layout ? props.layout : 'detail bg-transparent border-0'
// })

/*const hn: 1 | 4 | undefined =
  layout.value === 'detail' ? 1 : layout.value === 'admin' ? 4 : undefined*/

// Product content details
const productRef = toRef(props, 'product')
const { product: modelProduct, formattedPrice, imageAlt } = useProductModel(productRef)
const productTitleWrapper = computed(() => {
  return props.layout !== 'detail' ? RouterLink : 'span'
})
const productTitleWrapperProps = computed(() => {
  return productTitleWrapper.value !== 'span' && modelProduct.value
    ? { to: `/product/${modelProduct.value.id}` }
    : null
})
const productContent = computed(() => {
  return props.layout === 'detail' && modelProduct.value
    ? {
        productDescription: modelProduct.value.description,
        productTitle: modelProduct.value.title,
      }
    : {
        productDescription: modelProduct.value!.shortDesc,
        productTitle: modelProduct.value!.shortTitle,
      }
})

// Product
const productFooter = computed(() => {
  switch (props.layout) {
    case 'cart':
      return CartItemFooter
    case 'check':
      return CartItemFooterCheck
    case 'admin':
      return CartItemFooterAdmin
    default:
      return ProductItemFooterDefault
  }
})
</script>
<template>
  <Card v-if="product" :class="['py-0 relative card gap-0', gridClass, compLayout, props.layout]">
    <CardHeader class="card-header grid-cols-[1fr_auto] gap-x-4">
      <ProductTitle :hn="props.hn">
        <component :is="productTitleWrapper" v-bind="productTitleWrapperProps">
          {{ productContent.productTitle }}
        </component>
      </ProductTitle>
      <div class="flex flex-row-reverse items-center">
        <CardDescription class="price text-primary max-w-[100px]">
          {{ formattedPrice }}
        </CardDescription>
        <p
          v-if="props.showItemId !== false && layout === 'admin' && productRef.archived"
          class="text-xs border px-2 mr-4 py-1"
        >
          <span class="sr-only">Produit</span> archivé
        </p>
      </div>
    </CardHeader>

    <div class="id" v-if="props.showItemId !== false && layout === 'admin'">
      <p><span class="sr-only">ID du produit : </span>{{ productRef.id }}</p>
    </div>

    <img :src="product.image" :alt="imageAlt" class="object-contain img" />

    <!-- v-if="layout !== 'detail' && layout !== 'admin'" -->
    <CardContent :class="['h-full card-content', displayFooter === false ? 'pb-4' : undefined]">
      {{ productContent.productDescription }}
    </CardContent>

    <component
      class="card-footer mt-6"
      v-if="displayFooter"
      :is="productFooter"
      :layout
      :product
    ></component>
  </Card>
</template>
<style lang="css">
@import '@/assets/styles/productCard.css';
</style>
