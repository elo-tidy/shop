<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppSidebar from '@/components/header/AppSidebar.vue'
import Breadcrumbs from '@/components/header/Breadcrumbs.vue'
import CardItem from '@/components/modules/cart/CartItem.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/store/ProductStore'
const productStore = useProductStore()

onMounted(() => {
  productStore.loadProducts()
})

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main role="main">
      <Breadcrumbs />
      <CardItem />
      <!-- <h1 class="mb-10 text-[30px]">{{ titleStore.title }}</h1> -->
      <RouterView />
    </main>
    <footer role="contentinfo" class="border-t text-right">
      <p>© 2025 Fictive Shop</p>
    </footer>
  </SidebarProvider>
</template>
