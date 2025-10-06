<script setup>
import { onMounted, ref, toRefs, computed, watch } from 'vue'
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
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { getUserProfile, updateProfileService, signOutService } from '@/services/SupabaseServices'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/store/CartStore'
const route = useRoute()
const history = route.query.history

const props = defineProps(['session'])
const { session } = toRefs(props)
const cartDetail = useCartStore().cart

const loading = ref(true)
const username = ref('')
const email = computed(() => session.value.user.email)

watch(
  () => session.value,
  async (currentSession) => {
    if (history === 'order' && currentSession?.user?.id && cartDetail.products.length) {
      try {
        router.push('/cart')
      } catch (error) {
        toast(error.message || 'Erreur lors de la création du panier')
      }
    }
  },
  { immediate: true, once: true },
)

onMounted(async () => {
  getProfile()
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
    <Form @submit="updateProfile">
      <fieldset>
        <legend>Modifier mes informations de profil</legend>
        <!-- <FormField :name="email"> -->

        <FormField name="username">
          <FormItem class="grid w-full gap-4 mb-4">
            <FormLabel>Nom d'utilisateur</FormLabel>
            <FormControl>
              <Input id="username" class="inputField" type="text" v-model="username" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="email">
          <FormItem class="grid w-full gap-4 mb-4">
            <FormLabel>Adresse mail</FormLabel>
            <FormControl>
              <Input id="email" class="inputField" type="email" disabled v-model="email" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormItem class="grid w-full gap-4 mb-4 justify-end">
          <input
            type="submit"
            class="button primary block"
            :value="loading ? 'En cours de mise à jour ...' : 'Mettre à jour mon profil'"
            :disabled="loading"
          />
        </FormItem>
      </fieldset> </Form
  ></Card>
</template>
