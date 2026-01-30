<script setup lang="ts">
import { RouterView } from 'vue-router'
// UI
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { Button } from './components/ui/button'
// Components
import AppSidebar from '@/components/header/AppSidebar.vue'
import Breadcrumbs from '@/components/header/Breadcrumbs.vue'
// import type { Button } from './components/ui/button'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main role="main">
      <Breadcrumbs />
      <RouterView />
    </main>
    <footer role="contentinfo" class="border-t text-right">
      <p>© 2025 Fictive Shop</p>
    </footer>
  </SidebarProvider>
  <Toaster :expand="false" :duration="Infinity" closeButton position="top-right"> </Toaster>
</template>
