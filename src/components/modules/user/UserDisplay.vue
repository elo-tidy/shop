<script lang="ts" setup>
import { useSupabaseSession } from '@/composables/useSupabaseSession'
const { session } = useSupabaseSession()
</script>
<template v-if="session">
  <RouterLink :to="{ name: 'auth' }">Mon profil</RouterLink>
</template>
