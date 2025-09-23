<script setup>
import { watch, ref } from 'vue'

import CartItem from '@/components/modules/cart/CartItem.vue'
import { toast } from 'vue-sonner'

import { inserCartService, getLastCartDetail } from '@/services/SupabaseServices'
import { useCartStore } from '@/store/CartStore.ts'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
import { useCartModel } from '@/composables/useCartModel'

const cartStore = useCartStore()
const cartDetail = cartStore.cart
const { session } = useSupabaseSession()
const order = ref(null)

watch(
  () => session.value?.user?.id,
  async (userId) => {
    if (userId && cartDetail.products.length) {
      try {
        //Insert into BDD
        await inserCartService(userId, { products: cartDetail.products })
        // Empty store
        await cartStore.clearCartStore()
        // Display order
        const latestOrder = await getLastCartDetail(userId)
        order.value = latestOrder
      } catch (error) {
        toast(error.message)
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <h1 class="mb-10 text-[30px]">Vérification de mon panier</h1>

  <template v-if="order">
    <CartItem :cart="order" layout="check" />
  </template>
  <template v-else>
    <div class="loader-wrapper grid auto-cols-max grid-flow-col gap-4 iplace-items-center">
      <div class="loader"></div>
      <p>Données en cours de chargement</p>
    </div></template
  >
</template>
