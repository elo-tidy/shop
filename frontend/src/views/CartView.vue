<script lang="ts" setup>
import CartItem from '@/components/modules/cart/CartItem.vue'

import { useCartStore } from '@/store/CartStore'
import { useCartDetails } from '@/composables/useCartDetails'

const cartStore = useCartStore()

const { cartData: productInCart } = useCartDetails()
</script>
<template>
  <h1 class="mb-10 text-[30px]">Détail de mon panier</h1>
  <CartItem :products="productInCart?.products" />
</template>
