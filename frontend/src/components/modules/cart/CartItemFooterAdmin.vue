<script lang="ts" setup>
import { ref } from 'vue'
// types
import type { productAdd, productDelete } from '@/types/Product'
// Ui
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
// api
import { deleteProduct } from '@/api/products'
// Store
import { useProductStore } from '@/store/ProductStore'

// Data
const props = defineProps<{
  product: productAdd
}>()
const payload_api = ref<productDelete | null>(null)
const productStore = useProductStore()

const deleteThisProduct = async (payload: productDelete) => {
  try {
    await deleteProduct(payload)
    productStore.removeProductFromStore(payload.id)
    toast(`Produit id:"${payload.id}" supprimé avec succès`)
  } catch (err) {
    console.error(err)
  }
}

const handleDeleteClick = (productId: productAdd['id']) => {
  payload_api.value = { id: productId }
  deleteThisProduct(payload_api.value)
}
</script>
<template>
  <div class="footer-admin grid grid-flow-col gap-4">
    <RouterLink
      v-if="props.product.id"
      class="patch btn-icon bg-primary"
      :to="{ name: 'patch-product', params: { id: props.product.id } }"
    >
      <span class="sr-only">Modifier la fiche produit</span>
    </RouterLink>
    <Button
      class="delete btn-icon bg-primary"
      type="button"
      @click="handleDeleteClick(props.product.id)"
    >
      <span class="sr-only">Supprimer la fiche produit</span>
    </Button>
  </div>
</template>
