import { defineStore } from 'pinia'
import { Product } from '../models/Product'
import type { ProductApi } from '../types/Product'
import { fetchAllProducts } from '../services/ShopService'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,
    currentCategory: null as string | null,
  }),
  actions: {
    async loadProducts() {
      this.isLoading = true
      this.error = null
      try {
        const data: ProductApi[] = await fetchAllProducts()
        this.products = data.map((item) => new Product(item))
      } catch (error: any) {
        console.error('Erreur lors du fetch des produits', error)
        this.error = error.message || 'Erreur inconnue'
      } finally {
        this.isLoading = false
      }
    },
    updateCurrentCategory(category: string) {
      this.currentCategory = category
    },
  },
  getters: {
    getProductById: (state) => (id: string) =>
      state.products.find((product) => product.id.toString() === id),

    filteredProducts: (state) => {
      return state.currentCategory
        ? state.products.filter((p) => p.category === state.currentCategory)
        : state.products
    },
  },
})
