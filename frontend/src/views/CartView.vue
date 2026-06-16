<script lang="ts" setup>
import { computed } from 'vue'
// Components
import CartItem from '@/components/modules/cart/CartItem.vue'
// Store
import { useCartStore } from '@/store/CartStore'
import type { cartProduct } from '@/types/Cart'
const cartStore = useCartStore()
const products = computed(() => cartStore.cart.products)
</script>
<template>
  <h1 class="mb-10 text-[30px]">Détail de mon panier</h1>
  <CartItem :products />
</template>
