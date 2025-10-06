<script lang="ts" setup>
import CartItem from '@/components/modules/cart/CartItem.vue'

import { useCartStore } from '@/store/CartStore'
import { useCartModel } from '@/composables/useCartModel'

const cartStore = useCartStore()

const { cart: productInCart } = useCartModel(cartStore.cart)
</script>
<template>
  <h1 class="mb-10 text-[30px]">Détail de mon panier</h1>
  <CartItem :cart="productInCart" />
</template>
