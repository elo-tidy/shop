<script lang="ts" setup>
// Composables
import { useIsUserAdmin } from '@/composables/useIsUserAdmin'
// Data
const { currentSessionIsAdmin } = useIsUserAdmin()
</script>
<template v-if="currentSessionIsAdmin">
  <RouterLink :to="{ name: 'admin' }" class="btn-sidebar btn-admin border">Espace Admin</RouterLink>
</template>
