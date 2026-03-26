<script lang="ts" setup>
import { computed } from 'vue'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
const session = useSupabaseSession()
const linkTitle = computed(() => (session.session.value?.user ? 'Mon profil' : 'Se connecter'))
</script>
<template>
  <RouterLink :to="{ name: 'auth' }" class="btn-sidebar btn-profile border">
    {{ linkTitle }}
  </RouterLink>
</template>
