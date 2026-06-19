<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductItem from '@/components/modules/product/ProductItem.vue'

import { useProductStore } from '@/store/ProductStore'
import type { productCatalog } from '@shared/types/Product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const product = ref<productCatalog | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)

  if (!id) {
    return router.replace('/404')
  }

  let found = productStore.getProductById(id)
  if (!found) {
    await productStore.loadProducts()
    found = productStore.getProductById(id)
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
