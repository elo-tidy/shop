<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Product } from '@/models/Product.ts'

const props = defineProps<{
  product: Product
  productContent?: 'entire'
}>()

const productContent = computed(() => {
  return props.productContent === 'entire'
    ? {
        productDescription: props.product.description,
        productTitle: props.product.title,
      }
    : {
        productDescription: props.product.shortDesc,
        productTitle: props.product.shortTitle,
      }
})
</script>
<template>
  <Card class="py-0 relative" v-if="product">
    <CardHeader class="px-6">
      <CardTitle>
        <!-- <RouterLink :to="`/${product.id}`">{{ product.title }}</RouterLink> -->
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">{{
          productContent.productTitle
        }}</RouterLink>
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
      {{ productContent.productDescription }}
    </CardContent>
    <CardFooter class="flex jpx-6 pb-6 justify-end-safe">
      <Button>Ajouter au panier</Button>
    </CardFooter>
  </Card>
</template>
