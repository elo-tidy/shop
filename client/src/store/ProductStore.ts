// src/store/ProductStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllProducts } from '../services/ShopService'
import type { ProductApi } from '../types/Product'

export const useProductStore = defineStore(
  'product',
  () => {
    // State
    const products = ref<ProductApi[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const currentCategory = ref<string | null>(null)

    // Actions
    async function loadProducts() {
      if (products.value.length > 0) return

      isLoading.value = true
      error.value = null

      try {
        const data = await fetchAllProducts()
        products.value = data
        // products.value = data.map((item) => new Product(item))
      } catch (err: any) {
        console.error('Erreur lors du fetch des produits', err)
        error.value = err.message || 'Erreur inconnue'
      } finally {
        isLoading.value = false
      }
    }

    function updateCurrentCategory(category: string | null) {
      currentCategory.value = category
    }

    // Getters
    const getProductById = computed(() => (id: string) => {
      return products.value.find((product) => product.id.toString() === id)
    })

    const filteredProducts = computed(() => {
      return currentCategory.value
        ? products.value.filter((p) => p.category === currentCategory.value)
        : products.value
    })

    return {
      products,
      isLoading,
      error,
      currentCategory,

      loadProducts,
      updateCurrentCategory,

      getProductById,
      filteredProducts,
    }
  },
  {
    persist: true,
  },
)
