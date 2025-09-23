<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import CartButton from '@/components/modules/cart/CartSectionLink.vue'
import userInfo from '@/components/modules/user/UserDisplay.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
const { session } = useSupabaseSession()

const backToTop = ref()
</script>

<template>
  <header role="banner">
    <span ref="backToTop" tabindex="-1" />
    <ul id="skip-links" class="z-11 bg-foreground text-background">
      <li>
        <a href="#main">Passer au contenu principal</a>
      </li>
    </ul>
    <!-- <Sidebar v-bind="props"> -->
    <Sidebar>
      <SidebarHeader class="px-6">
        <!-- <VersionSwitcher :versions="data.versions" :default-version="data.versions[0]" /> -->
        <!-- <SearchForm /> -->
        <img
          alt="Logo boutique"
          class="logo"
          src="@/assets/img/logo.svg"
          width="125"
          height="125"
        />
      </SidebarHeader>
      <SidebarContent class="px-6">
        <nav role="navigation">
          <ul>
            <li v-if="session">
              <userInfo />
            </li>
            <li>
              <CartButton />
            </li>
            <li>
              <RouterLink :to="{ name: 'catalogue' }">Catalogue produits</RouterLink>
            </li>
          </ul>
        </nav>
      </SidebarContent>
    </Sidebar>
  </header>
</template>
