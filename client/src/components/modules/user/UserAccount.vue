<script setup>
import { onMounted, ref, computed } from 'vue'
import router from '@/router'
// Ui
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
// Services
import {
  getUserProfile,
  updateProfileService,
  signOutService,
} from '../../../../../shared/services/SupabaseServices'
// Composables
import { useSupabaseSession } from '@/composables/useSupabaseSession'

// Refs
const loading = ref(true)
const username = ref('')

// Data
const { session } = useSupabaseSession()
const email = computed(() => session.value.user.email)

// User
onMounted(async () => {
  await getProfile()
})
async function getProfile() {
  try {
    loading.value = true
    const { user } = session.value
    const { data } = await getUserProfile(user.id)
    if (data) {
      username.value = data.username
    }
  } catch (error) {
    toast(error.message)
  } finally {
    loading.value = false
  }
}
async function updateProfile() {
  try {
    loading.value = true
    const { user } = session.value
    await updateProfileService(user.id, username.value)
    toast('Mise à jour enregistrée')
  } catch (error) {
    toast(error.message)
  } finally {
    loading.value = false
  }
}
async function signOut() {
  try {
    loading.value = true
    await signOutService()
    toast('Vous avez bien été déconnecté')
    router.push('/')
  } catch (error) {
    toast(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex max-w-xl justify-between">
    <h1 class="mb-10 text-[30px]">Mon profil</h1>
    <Button class="button block" @click="signOut" :disabled="loading">Se déconnecter</Button>
  </div>
  <Card class="px-6 max-w-xl">
    <form @submit.prevent="updateProfile">
      <FieldSet>
        <FieldLegend variant="label">Modifier mes informations de profil</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel for="username">Nom d'utilisateur</FieldLabel>
            <Input id="username" class="inputField" type="text" v-model="username" />
          </Field>
          <Field>
            <FieldLabel for="email">Adresse mail</FieldLabel>
            <Input id="email" class="inputField" type="email" disabled v-model="email" />
          </Field>
          <Field class="grid w-full gap-4 mb-4 justify-end">
            <input
              type="submit"
              class="button primary block"
              :value="loading ? 'En cours de mise à jour ...' : 'Mettre à jour mon profil'"
              :disabled="loading"
            />
          </Field>
        </FieldGroup>
      </FieldSet></form
  ></Card>
</template>
