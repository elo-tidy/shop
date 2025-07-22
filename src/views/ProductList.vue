<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})

interface ProductApiTypes {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}
</script>

<template>
  <div v-if="productStore.isLoading">Chargement des produits...</div>

  <div class="grid grid-cols-3 gap-6" v-else>
    <Card v-for="product in productStore.products" :key="product.id" class="py-0 relative">
      <CardHeader class="px-6">
        <CardTitle>
          <RouterLink :to="{ name: 'product', params: { id: product.id } }">{{
            product.title
          }}</RouterLink>
        </CardTitle>
        <CardDescription class="absolute top-0 right-0 bg-background text-primary px-1 py-1">{{
          product.formattedPrice
        }}</CardDescription>
        <!-- <p>{{ product.category }}</p> -->
      </CardHeader>
      <img
        :src="product.image"
        :alt="product.imageAlt"
        class="w-full h-48 object-cover order-first"
      />
      <CardContent class="h-full">
        <p>{{ product.shortDesc }}</p>
      </CardContent>
      <CardFooter class="flex jpx-6 pb-6 justify-end-safe">
        <Button>Ajouter au panier</Button>
      </CardFooter>
    </Card>
  </div>
</template>
