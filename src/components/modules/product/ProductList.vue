<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductStore } from '@/store/ProductStore'
import ProductCard from './ProductItem.vue'

const productStore = useProductStore()
const nbProduct = computed(() => productStore.filteredProducts.length)
const wording = computed(() => (nbProduct.value === 1 ? 'Produit' : 'Produits'))
</script>

<template>
  <p class="mb-4" aria-atomic="true">
    <span aria-live="polite">{{ nbProduct }}</span> {{ wording }}
    <span class="sr-only" v-if="productStore.currentCategory !== ''"
      >dans la catégorie {{ productStore.currentCategory }}</span
    >
  </p>
  <div v-if="productStore.isLoading">Chargement des produits...</div>
  <div class="grid grid-cols-3 gap-6" v-else>
    <ProductCard v-for="product in productStore.filteredProducts" :product />
  </div>
</template>
