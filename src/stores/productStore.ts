import { defineStore } from 'pinia'
import { Product } from '@/models/Product'
import type { ProductApi } from '@/types/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data: ProductApi[] = await response.json()
        this.products = data.map((item) => new Product(item))
      } catch (error: any) {
        console.error('Erreur lors du fetch des produits', error)
        this.error = error.message || 'Erreur inconnue'
      } finally {
        this.isLoading = false
      }
    },

    getProductById(id: string) {
      return this.products.find((product) => product.id.toString() === id)
    },
  },
})
