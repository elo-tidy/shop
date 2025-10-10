<script lang="ts" setup>
import { useSupabaseSession } from '@/composables/useSupabaseSession'
const session = useSupabaseSession()
</script>
<template v-if="session">
  <RouterLink :to="{ name: 'auth' }" class="btn-sidebar btn-profile border"
    ><span class="sr-only">Voir </span>Mon profil</RouterLink
  >
</template>
