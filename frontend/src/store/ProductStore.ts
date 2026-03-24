import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// Types
import type { productAdd } from '../types/Product'
// Services
import { fetchAllProducts } from '../services/ShopService'

export const useProductStore = defineStore(
  'product',
  () => {
    // State
    const adminDisplay = ref(false)   
    const products = ref<productAdd[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const currentCategory = ref<string | null>(null)
    const productsNb = computed(():number => products.value.length)

    // Actions
    async function loadProducts() {
      if (products.value.length > 0) return

      isLoading.value = true
      error.value = null

      try {
        const data: productAdd[] = await fetchAllProducts()
        products.value = data
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

    function addProductToStore(product: productAdd) {
      products.value.push(product)
      // products.value = [...products.value, product]
    }

    function removeProductFromStore(id: number) {
      const index = products.value.findIndex((p:productAdd) => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
    }

    function updateProductInStore(product: productAdd) {
      products.value = products.value.map((p:productAdd) => p.id === product.id ? product : p)     
    }

    function setAdminDisplay(isAdmin: boolean) {
      adminDisplay.value = isAdmin
    }

    // Getters
    const getProductById = computed(() => (id: string) => {
      return products.value.find((product:productAdd) => product.id.toString() === id)
    })

    const getPublicProducts = computed(() => {
      return products.value.filter((p:productAdd) => p.archived === false)
    })

    const filteredProducts = computed(() => {

      if( adminDisplay.value === true) {
        return currentCategory.value
        ? products.value.filter((p:productAdd) => p.category === currentCategory.value)
        : products.value
      }

      return currentCategory.value
        ? getPublicProducts.value.filter((p:productAdd) => p.category === currentCategory.value)
        : getPublicProducts.value
    })

    return {
      products,
      isLoading,
      error,
      currentCategory,
      productsNb,

      loadProducts,
      updateCurrentCategory,
      addProductToStore,
      removeProductFromStore,
      updateProductInStore,
      setAdminDisplay,

      getProductById,
      filteredProducts,
    }
  },
  {
    persist: true,
  },
)
