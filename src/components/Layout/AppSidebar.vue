<script setup lang="ts">
// import SearchForm from '@/components/SearchForm.vue'
// import VersionSwitcher from '@/components/VersionSwitcher.vue'

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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  },
)

// const props = defineProps<SidebarProps>()
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

        <div class="wrapper"></div>
      </SidebarHeader>
      <SidebarContent class="px-6">
        <nav role="navigation">
          <ul>
            <li><RouterLink to="/">Catalogue produits</RouterLink></li>
            <li><RouterLink to="/about">About</RouterLink></li>
          </ul>
        </nav>
      </SidebarContent>
    </Sidebar>
  </header>
</template>
