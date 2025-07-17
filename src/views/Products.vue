<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

const products = ref<Product[]>([])

onMounted(() => {
  fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      products.value = data
    })
    .catch((error) => {
      console.error('Erreur lors du fetch des produits', error)
    })
})
</script>

<template>
  <div v-if="products.length === 0">Chargement des produits...</div>

  <div class="grid grid-cols-3 gap-6" v-else>
    <Card v-for="product in products" :key="product.id" class="py-0 relative">
      <CardHeader class="px-6">
        <CardTitle>{{ product.title }}</CardTitle>
        <CardDescription class="absolute top-0 right-0 bg-background text-primary px-1 py-1"
          >{{ product.price }} €</CardDescription
        >
        <!-- <p>{{ product.category }}</p> -->
      </CardHeader>
      <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover order-first" />
      <CardContent class="h-full">
        <p class="truncate">{{ product.description }}</p>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6 justify-end-safe">
        <Button>Ajouter au panier</Button>
      </CardFooter>
    </Card>
  </div>
</template>
