<script lang="ts" setup>
// components
import ProductList from '@/components/modules/product/ProductList.vue'
import CategoryList from '@/components/modules/category/CategoryList.vue'
// store
import { useProductStore } from '@/store/ProductStore'
const productStore = useProductStore()
productStore.setAdminDisplay(false)
</script>
<template>
  <h1 class="mb-10 text-[30px]">Catalogue</h1>
  <CategoryList />
  <ProductList display="card" />
</template>
