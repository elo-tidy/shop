<script lang="ts" setup>
// Composables
import { useIsUserAdmin } from '@/composables/useIsUserAdmin'
// Data
const { currentSessionIsAdmin } = useIsUserAdmin()
</script>
<template>
  <RouterLink
    v-if="currentSessionIsAdmin"
    :to="{ name: 'admin' }"
    class="btn-sidebar btn-admin border"
    >Espace Admin</RouterLink
  >
</template>
