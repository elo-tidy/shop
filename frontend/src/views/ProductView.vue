<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductItem from '@/components/modules/product/ProductItem.vue'

import { useProductStore } from '@/store/ProductStore'
import type { ProductApi } from '@/types/Product'

const route = useRoute()
const router = useRouter()
const store = useProductStore()

const product = ref<ProductApi | null>(null)

onMounted(async () => {
  const id = route.params.id?.toString()

  if (!id) {
    return router.replace('/404')
  }

  let found = store.getProductById(id)
  if (!found) {
    await store.loadProducts()
    found = store.getProductById(id)
  }

  if (!found) {
    return router.replace('/404')
  }

  product.value = found
})
</script>

<template>
  <ProductItem v-if="product" :product="product" layout="detail" />
  <p v-else>Produit introuvable...</p>
</template>
