<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Components
import ProductAdd from '@/components/modules/product/ProductItemAdd.vue'
// Api
import { getAdminDashboard } from '@/api/admin'

// Server auth
const grantedAccess = ref<boolean | null>(null)
const router = useRouter()
onMounted(async () => {
  try {
    grantedAccess.value = await getAdminDashboard()
  } catch (error: any) {
    if (error.context?.status === 403) {
      await router.replace('/forbidden')
    } else {
      throw error
    }
  }
})
</script>
<template>
  <ProductAdd v-if="grantedAccess" />
</template>
