<script setup lang="ts">
import { RouterView } from 'vue-router'
// UI
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
// Components
import AppSidebar from '@/components/header/AppSidebar.vue'
import Breadcrumbs from '@/components/header/Breadcrumbs.vue'
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
  <Toaster
    :expand="false"
    :duration="Infinity"
    :closeButton="true"
    position="top-right"
    :containerAriaLabel="'Espace de notifications'"
    :closeButtonAriaLabel="'Fermer la fenêtre de notification'"
    :toastOptions="{
      unstyled: true,
      classes: {
        toast: 'p-4 pr-8 bg-background border text-sm text-white',
        closeButton: 'absolute top-2 right-2 w-[20px] h-[20px] text-white hover:text-primary',
      },
    }"
  >
  </Toaster>
</template>
