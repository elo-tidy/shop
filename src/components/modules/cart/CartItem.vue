<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import ProductItem from '@/components/modules/product/ProductItem.vue'

import type { ProductApi } from '@/types/Product'
import type { CartType } from '@/types/Cart'

import { useCartStore } from '@/store/CartStore'
import { useCartModel } from '@/composables/useCartModel'
import { useSupabaseSession } from '@/composables/useSupabaseSession'

const cartStore = useCartStore()
const { session } = useSupabaseSession()
const route = useRoute()

const props = defineProps<{
  cart: CartType
  layout?: 'check'
}>()

const dataCart = computed(() => {
  return props.cart ? useCartModel(props.cart) : null
})

const layout = computed(() => (props.layout ? props.layout : 'cart'))

const product_list = computed<ProductApi[]>(() =>
  props.cart?.products ? props.cart?.products : cartStore.cart.products,
)
const cta = computed(() => {
  if (session.value?.user.aud === 'authenticated') {
    return {
      wording: 'Finaliser ma commande',
      link: { name: 'order', query: { step: '1' } },
    }
  } else {
    return {
      wording: 'Valider mon panier',
      link: { name: 'auth', query: { history: 'order' } },
    }
  }
})
</script>

<template>
  <div v-if="product_list.length" class="shoping-cart">
    <ul class="grid border bg-background">
      <li class="not-first:border-t p-5" v-for="item in product_list" :key="item.id">
        <productItem :product="item" :layout="layout" />
      </li>
    </ul>
    <div class="text-right">
      <p class="total">
        <span
          >Sous-total ({{ dataCart?.totalNumberOfItem }} {{ dataCart?.wordingTotalNumberOfItem }})
          :</span
        >
        {{ dataCart?.orderPrice }} €
      </p>

      <p v-if="layout !== 'check' && route.name !== 'order'">
        <RouterLink :to="cta.link" id="order" class="btn">{{ cta.wording }} </RouterLink>
      </p>
    </div>
  </div>
  <div v-else class="empty-cart">
    <p>Votre panier est vide</p>
  </div>
</template>
<style lang="css" scoped>
@import '@/assets/styles/cart.css';
</style>
