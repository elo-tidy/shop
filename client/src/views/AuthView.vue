<script setup>
// Components
import Account from '@/components/modules/user/userAccount.vue'
import Auth from '@/components/modules/user/UserAuth.vue'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
// Composables
const { session } = useSupabaseSession()
</script>

<template>
  <Account v-if="session" />
  <Auth v-else />
</template>
