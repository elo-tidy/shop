<script setup lang="ts">
// Ui
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
// Components
import CartButton from '@/components/modules/cart/CartSectionLink.vue'
import userInfo from '@/components/modules/user/UserDisplay.vue'
import dashboard from '@/components/modules/admin/AdminDashboard.vue'
// Composables
import { useIsUserAdmin } from '@/composables/useIsUserAdmin'

// Data
const { currentSessionIsAdmin } = useIsUserAdmin()
</script>

<template>
  <header role="banner">
    <ul id="skip-links" class="z-11 bg-foreground text-background relative">
      <li>
        <a href="#main">Passer au contenu principal</a>
      </li>
    </ul>
    <Sidebar>
      <SidebarHeader class="px-6">
        <!-- <SearchForm /> -->
        <img
          alt="Logo boutique fictive"
          class="logo"
          src="@/assets/img/logo.svg"
          width="125"
          height="125"
        />
      </SidebarHeader>
      <SidebarContent class="px-6 pt-1">
        <nav role="navigation">
          <ul class="grid gap-y-2">
            <li v-if="currentSessionIsAdmin">
              <dashboard />
            </li>
            <li>
              <userInfo />
            </li>
            <li>
              <CartButton />
            </li>
            <li class="mt-5 pt-2 border-t-1">
              <RouterLink :to="{ name: 'catalogue' }">Catalogue produits</RouterLink>
            </li>
          </ul>
        </nav>
      </SidebarContent>
    </Sidebar>
  </header>
</template>
