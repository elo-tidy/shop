<script lang="ts" setup>
// Composants
import ProductList from '@/components/modules/product/ProductList.vue'
// Composables
import { useSupabaseSession } from '@/composables/useSupabaseSession'
const { session } = useSupabaseSession()
</script>
<template>
  <h1 class="mb-10 text-[30px]">Gestion des produits</h1>
  <ProductList />
</template>
