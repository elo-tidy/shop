<script setup lang="ts">
// Ui
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'
// Components
import CartButton from '@/components/modules/cart/CartSectionLink.vue'
import userInfo from '@/components/modules/user/UserDisplay.vue'
import dashboard from '@/components/modules/admin/AdminDashboard.vue'
// Composables
import { useIsUserAdmin } from '@/composables/useIsUserAdmin'

// Data
const { currentSessionIsAdmin } = useIsUserAdmin()
const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar()

const sidebarIsVisible = (): boolean => {
  if (isMobile.value) return false
  // if (openMobile.value) return false
  // if (open.value) return true
  return true
}

const tglSidebar = () => {
  console.log(state.value)
  console.log(open.value)
  console.log(isMobile.value)
  console.log(openMobile.value)
  toggleSidebar()
}
</script>

<template>
  <div
    v-if="isMobile"
    class="fixed bottom-0 grid grid-flow-col grid-cols-[auto_1fr] w-full py-1.5 px-[clamp(0.9375rem,-0.1786rem+5.5804vw,2.5rem)] z-2 gap-5"
  >
    <Button
      variant="ghost"
      type="button"
      title="Ouvrir le menu de principal"
      @click="toggleSidebar()"
      aria-controls="sidebar"
      id="menuBtn"
    >
      <span class="sr-only">Ouvrir le menu de principal</span>
    </Button>
    <p class="pr-[clamp(7.5rem,12.8571rem+-26.7857vw,0rem)]">
      <img
        alt="Logo boutique fictive"
        class="object-none size-9"
        src="@/assets/img/logo.svg"
        width="125"
        height="125"
      />
    </p>
  </div>
  <Sidebar
    variant="sidebar"
    id="sidebar"
    :aria-hidden="!open"
    :aria-expanded="state === 'expanded' ? true : false"
  >
    <SidebarHeader class="px-6">
      <!-- <SearchForm /> -->
      <p>
        <img
          alt="Logo boutique fictive"
          class="logo"
          src="@/assets/img/logo.svg"
          width="125"
          height="125"
        />
      </p>
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
          <li class="mt-5 pt-2 border-t">
            <RouterLink :to="{ name: 'catalogue' }">Catalogue produits</RouterLink>
          </li>
        </ul>
      </nav>
    </SidebarContent>
  </Sidebar>
</template>
