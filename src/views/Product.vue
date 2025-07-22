<script lang="ts" setup>
import { Product } from '@/models/Product'
import { useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTitleStore } from '@/stores/titlesStore'

const product = ref<Product | null>(null)
const route = useRoute()
const titleStore = useTitleStore()

onMounted(() => {
  fetch(`https://fakestoreapi.com/products/${route.params.id}`)
    .then((response) => response.json())
    .then((data) => {
      product.value = new Product(data)
      if (product.value) {
        titleStore.setTitle(product.value.title)
      }
    })
    .catch((error) => {
      console.error('Erreur lors du fetch des produits', error)
      titleStore.resetTitle()
    })
})
onUnmounted(() => {
  titleStore.resetTitle()
})
</script>
<template>
  <div class="grid grid-cols-1">
    <Card class="py-0 relative" v-if="product">
      <CardHeader class="px-6">
        <CardTitle>
          <RouterLink :to="`/product/${product.id}`">{{ product.title }}</RouterLink>
        </CardTitle>
        <CardDescription class="absolute top-0 right-0 bg-background text-primary px-1 py-1">{{
          product.formattedPrice
        }}</CardDescription>
      </CardHeader>
      <img
        :src="product.image"
        :alt="product.imageAlt"
        class="w-full h-48 object-cover order-first"
      />
      <CardContent class="h-full">
        <p>{{ product.description }}</p>
      </CardContent>
      <CardFooter class="flex jpx-6 pb-6 justify-end-safe">
        <Button>Ajouter au panier</Button>
      </CardFooter>
    </Card>
  </div>
</template>
<style land="css" scoped></style>
