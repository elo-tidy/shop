<script setup>
import { ref } from 'vue'
// Ui
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'vue-sonner'
// Services
import { sendMagicLink } from '@/services/SupabaseServices'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    await sendMagicLink(email.value)
    toast('Merci de vérifier votre boite mail')
  } catch (error) {
    if (error instanceof Error) {
      toast(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1 class="mb-10 text-[30px]">S'identifier ou créer un compte</h1>
  <Card class="px-6 max-w-xl">
    <form @submit.prevent="handleLogin">
      <FieldSet>
        <FieldLegend variant="label">S'identifier</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel for="email">Adresse mail</FieldLabel>
            <Input id="email" class="inputField" required type="email" v-model="email" />
          </Field>
          <Field class="grid w-full gap-4 mb-4 justify-end">
            <input
              :disabled="loading"
              :value="loading ? 'En cours' : 'Envoyer un lien de connexion'"
              type="submit"
            />
          </Field>
        </FieldGroup>
      </FieldSet></form
  ></Card>
</template>
