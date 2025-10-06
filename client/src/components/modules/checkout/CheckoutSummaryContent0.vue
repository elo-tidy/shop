<script lang="ts" setup>
// Components
import CartItem from '@/components/modules/cart/CartItem.vue'
// Stores
import { useCartStore } from '@/store/CartStore'
// Composables
import { useCartModel } from '@/composables/useCartModel'
// Data : cart
const cartStore = useCartStore()
const { cart: productInCart } = useCartModel(cartStore.cart)
</script>
<template>
  <CartItem :cart="productInCart" v-if="productInCart.products.length" :layout="'check'" />
</template>
