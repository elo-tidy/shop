<script setup lang="ts">
import { computed } from 'vue'
// Components
import ProductCard from '@/components/modules/product/ProductItem.vue'
// Store
import { useProductStore } from '@/store/ProductStore'

// Data store
const productStore = useProductStore()
const productStoreDisplay = computed(() =>
  props.layout === 'admin' ? productStore.products : productStore.filteredProducts,
)
const nbProduct = computed(() => productStoreDisplay.value.length)
const wording = computed(() => (nbProduct.value > 1 ? 'articles' : 'article'))

if (productStore.products.length === 0) {
  productStore.loadProducts()
}

// Props
const props = withDefaults(
  defineProps<{
    layout?: 'admin' | 'detail' | 'liste'
    display?: 'grid' | 'card'
    hn?: 1 | 2 | 3 | 4
    showItemId?: boolean
  }>(),
  {
    display: 'grid',
    layout: 'liste',
  },
)

// Class
const gridClass = computed(() => (props.display === 'card' ? 'grid-cols-3 gap-6' : 'gap-y-2'))
const compLayout = computed(() =>
  props.display === 'grid' || !props.display === null ? 'grid-tpl' : 'card-tpl',
)
</script>

<template>
  <p class="mb-4" aria-atomic="true" aria-live="polite">
    {{ nbProduct }} {{ wording }}
    <span class="sr-only" v-if="productStore.currentCategory !== null"
      >dans la catégorie {{ productStore.currentCategory }}</span
    >
  </p>
  <div v-if="productStore.isLoading">Chargement des produits...</div>

  <div v-else :class="['grid', gridClass]">
    <ProductCard
      v-for="product in productStoreDisplay"
      :class="compLayout"
      :product
      :key="product.id"
      :layout="props.layout"
      :display="props.display"
      :showItemId="props.showItemId"
      :hn="props.hn"
    />
  </div>
</template>
