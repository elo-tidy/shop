<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppSidebar from './components/Layout/AppSidebar.vue'
import Breadcrumbs from './components/Layout/Breadcrumbs.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRoute } from 'vue-router'
import { useTitleStore } from '@/stores/titlesStore'
import router from '@/router'

const route = useRoute()

const titleStore = useTitleStore()

watch(
  () => router.currentRoute.value,
  () => {
    if (!titleStore.customTitle) {
      document.title = `Fictive Shop - ${titleStore.title}`
    }
  },
  { immediate: true },
)

watch(
  () => titleStore.title,
  (newTitle) => {
    document.title = `Fictive Shop - ${newTitle}`
  },
  { immediate: true },
)
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main role="main">
      <Breadcrumbs />
      <h1 class="mb-10 text-[30px]">{{ titleStore.title }}</h1>
      <RouterView />
    </main>
    <footer role="contentinfo" class="border-t text-right">
      <p>© 2025 Fictive Shop</p>
    </footer>
  </SidebarProvider>
</template>
