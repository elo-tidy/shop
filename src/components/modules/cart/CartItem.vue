<script lang="ts" setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/CartStore'
import ProductItem from '@/components/modules/product/ProductItem.vue'
const cartStore = useCartStore()
const wordingNbItem = computed(() => (cartStore.getCartTotaLItems === 1 ? 'article' : 'articles'))
</script>
<template>
  <div v-if="cartStore.cart.products.length" class="shoping-cart">
    <ul class="grid border bg-background">
      <li class="not-first:border-t p-5" v-for="item in cartStore.cart.products" :key="item.id">
        <productItem :product="item" layout="cart" />
      </li>
    </ul>
    <div class="text-right">
      <p class="total">
        <span>Sous-total ({{ cartStore.getCartTotaLItems }} {{ wordingNbItem }}) :</span>
        {{ cartStore.getCartTotalPrice }} €
      </p>
      <Button id="order" type="button" class="text-right">Passer commande</Button>
    </div>
  </div>
  <div v-else class="empty-cart">
    <p>Votre panier est vide</p>
  </div>
</template>
<style lang="css" scoped>
@import '@/assets/styles/cart.css';
</style>
