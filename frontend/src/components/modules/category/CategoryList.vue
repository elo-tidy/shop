<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'

import { Button } from '@/components/ui/button'

import { useProductStore } from '@/store/ProductStore'
import { fetchAllProductCategories } from '@/services/ShopService'

const categories = ref<string[] | null>(null)
const storeProducts = useProductStore()
const activeCategory = ref<null | string>(null)

const filterByCategory = (categorieName: string) => {
  storeProducts.updateCurrentCategory(categorieName)
  activeCategory.value = categorieName
}

const displayAllProduct = (categorieName: string) => {
  storeProducts.updateCurrentCategory(null)
  activeCategory.value = null
}

onMounted(async () => {
  categories.value = await fetchAllProductCategories()
})
</script>
<template>
  <ul class="grid grid-flow-col-dense auto-cols-min gap-3 mb-6">
    <li v-for="category in categories">
      <Button
        class="border-1 border-dashed"
        :variant="activeCategory === category ? 'default' : 'outline'"
        @click="filterByCategory(`${category}`)"
        :aria-current="activeCategory === category ? 'true' : 'false'"
      >
        <span class="sr-only">Afficher les produits de la catégorie </span>
        {{ category }}
      </Button>
    </li>
    <li>
      <Button
        class="border-1 border-dashed"
        :variant="activeCategory === null ? 'default' : 'outline'"
        @click="displayAllProduct('all')"
        :aria-current="activeCategory === null ? 'true' : 'false'"
        >Afficher tous les produits</Button
      >
    </li>
  </ul>
</template>
