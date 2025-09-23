<script setup>
import { ref } from 'vue'
import { sendMagicLink } from '@/services/SupabaseServices'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'vue-sonner'

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
    <Form @submit="handleLogin">
      <fieldset>
        <legend>S'identifier</legend>
        <FormField name="email">
          <FormItem class="grid w-full gap-4 mb-4">
            <FormLabel>Adresse mail</FormLabel>
            <FormControl>
              <Input class="inputField" required type="email" v-model="email" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormItem class="grid w-full gap-4 mb-4 justify-end">
          <input
            :disabled="loading"
            :value="loading ? 'En cours' : 'Envoyer un lien de connexion'"
            type="submit"
        /></FormItem>
      </fieldset> </Form
  ></Card>
</template>
