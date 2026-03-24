<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductStore } from '@/store/ProductStore'
import ProductCard from './ProductItem.vue'

const productStore = useProductStore()
const nbProduct = computed(() => productStore.filteredProducts.length)
const wording = computed(() => (nbProduct.value > 1 ? 'articles' : 'article'))

if (productStore.products.length === 0) {
  productStore.loadProducts()
}

// Props
const props = withDefaults(
  defineProps<{
    layout?: 'admin' | 'detail'
    display?: 'grid' | ''
    hn?: 1 | 2 | 3 | 4
    showItemId?: boolean
  }>(),
  {
    layout: 'detail',
    display: '',
  },
)

// Class
const gridClass = props.display === 'grid' ? '' : 'grid-cols-3 gap-6'
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
      v-for="product in productStore.filteredProducts"
      :product
      :key="product.id"
      :layout="props.layout"
      :display="props.display"
      :showItemId="props.showItemId"
      :hn="props.hn"
    />
  </div>
</template>
