<script setup>
import Account from '@/components/modules/user/userAccount.vue'
import Auth from '@/components/modules/user/UserAuth.vue'
import { useSupabaseSession } from '@/composables/useSupabaseSession'

const { session } = useSupabaseSession()
</script>

<template>
  <Account v-if="session" :session="session" />
  <Auth v-else />
</template>
