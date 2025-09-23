<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check, Circle, Dot } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CartItem from '@/components/modules/cart/CartItem.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'

import type { ShippingMode } from '@/types/ShippingMode'

import { useCartStore } from '@/store/CartStore'
import { useCartModel } from '@/composables/useCartModel'
import { fetchShippingOptions } from '@/services/ShippingOptions'

const cartStore = useCartStore()
const { cart: productInCart } = useCartModel(cartStore.cart)

// Progress
const stepIndex = ref<number>(1)
interface Step {
  step: number
  title: string
  description: string
  history: string
}
const steps: Step[] = [
  {
    step: 1,
    title: 'Étape 1',
    description: 'Vérification du panier',
    history: 'panier',
  },
  {
    step: 2,
    title: 'Étape 2',
    description: 'Adresse',
    history: 'adresse',
  },
  {
    step: 3,
    title: 'Étape 3',
    description: 'Livraison',
    history: 'livraison',
  },
  {
    step: 4,
    title: 'Étape 4',
    description: 'Paiement',
    history: 'paiement',
  },
  {
    step: 5,
    title: 'Étape 5',
    description: 'Confirmation',
    history: 'confirmation',
  },
]

const NextStep = () => {
  stepIndex.value++
  AddUrlHistory(stepIndex.value)
}
const PrevStep = () => {
  stepIndex.value--
  AddUrlHistory(stepIndex.value)
}

// Shipping option
const shippingOptions = ref<ShippingMode[] | []>([])
onMounted(async () => {
  shippingOptions.value = await fetchShippingOptions()
})
const selectedCarrier = ref<string | null>(null)
const selectThisCarrier = (carrierID: string) => {
  selectedCarrier.value = carrierID
}
const router = useRouter()
const route = useRoute()
const AddUrlHistory = (stepIndex: number) => {
  router.push({
    query: {
      ...route.query,
      step: stepIndex,
    },
  })
}
</script>
<template class="flex">
  <div class="grid gap-10">
    <h1 class="mb-10 text-[30px]">Commande</h1>

    <Stepper
      class="flex w-full items-start gap-2 -order-1"
      v-model="stepIndex"
      v-if="productInCart.products.length"
    >
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="relative flex w-full flex-col items-center justify-center"
        :step="step.step"
      >
        <StepperSeparator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        />

        <StepperTrigger as-child>
          <Button
            :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
            size="icon"
            class="z-10 rounded-full shrink-0"
            :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
            @click="AddUrlHistory(stepIndex)"
            :disabled="
              !selectedCarrier &&
              (stepIndex === 3 || Number(route.query.step) === 3) &&
              step.step > 3
            "
          >
            <Check v-if="state === 'completed'" class="size-5" />
            <Circle v-if="state === 'active'" />
            <Dot v-if="state === 'inactive'" />
          </Button>
        </StepperTrigger>

        <div class="mt-5 flex flex-col items-center text-center">
          <StepperTitle
            :class="[state === 'active' && 'text-primary']"
            class="text-sm font-semibold transition lg:text-base"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription
            :class="[state === 'active' && 'text-primary']"
            class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
          >
            {{ step.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </Stepper>
  </div>

  <!-- Check Order -->
  <div v-if="stepIndex === 1 || Number(route.query.step) === 1" id="order-products">
    <h2 class="mb-5 text-[23px]">Liste des articles</h2>
    <CartItem :cart="productInCart" v-if="productInCart.products.length" />
    <div v-else>
      <p>
        Vous n'avez plus d'articles dans votre panier

        <router-link class="btn clear-margin ml-4" to="/">Retour au catalogue produit</router-link>
      </p>
    </div>
  </div>

  <div v-if="stepIndex === 2 || Number(route.query.step) === 2" id="order-adress">
    <h2 class="mb-5 text-[23px]">Adresses</h2>
    <div class="grid gap-x-10 max-w-xxl grid-flow-col">
      <Card class="px-6">
        <Form @submit.prevent="">
          <fieldset>
            <legend>Informations de livraison</legend>
            <FormField name="nom">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Studio" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="adresse">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Rue Saint-Honoré" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="cp">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Code Postal</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="75001" type="number" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="ville">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Paris" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="pays">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="France" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormItem class="grid w-full gap-4 mb-4 justify-end">
              <input
                type="submit"
                class="button"
                value="Mettre à jour mon adresse de livraison"
                disabled
              />
            </FormItem>
          </fieldset> </Form
      ></Card>
      <Card class="px-6">
        <Form @submit.prevent="">
          <fieldset>
            <legend>Informations de livraison</legend>
            <FormField name="nom">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Studio" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="adresse">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Rue Saint-Honoré" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="cp">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Code Postal</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="75001" type="number" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="ville">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="Paris" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="pays">
              <FormItem class="grid w-full gap-4 mb-4">
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input class="inputField" placeholder="France" type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormItem class="grid w-full gap-4 mb-4 justify-end">
              <input
                type="submit"
                class="button"
                value="Mettre à jour mon adresse de facturation"
                disabled
              />
            </FormItem>
          </fieldset> </Form
      ></Card>
    </div>
  </div>

  <div v-if="stepIndex === 3 || Number(route.query.step) === 3" id="order-shipping-mode">
    <h2 class="mb-5 text-[23px]">Livraison</h2>
    <div class="grid gap-x-10 max-w-xxl grid-flow-col">
      <Card class="px-6">
        <CardHeader><h3>Choisir un mode de livraison</h3></CardHeader>

        <CardContent>
          <ul class="grid grid-cols-4 gap-x-4">
            <li v-for="shippingOption in shippingOptions" class="p-4 pt-10">
              <Button
                :class="['items-start', selectedCarrier === shippingOption.id ? 'selected' : null]"
                type="button"
                variant="outline"
                @click="selectThisCarrier(shippingOption.id)"
              >
                {{ shippingOption.carrier }}
              </Button>
              <span class="label">{{ shippingOption.label }}</span>
              <span class="price">{{ shippingOption.price }} €</span>
              <span class="desc">{{ shippingOption.description }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>

  <div v-if="stepIndex === 4 || Number(route.query.step) === 4">
    <h2 class="mb-5 text-[23px]">Paiement</h2>
    <!-- <div>4</div> -->
  </div>

  <div v-if="stepIndex === 5">
    <h2 class="mb-5 text-[23px]">Confirmation de commande</h2>
    <!-- <div>5</div> -->
  </div>

  <div
    :class="['grid grid-flow-col', stepIndex != 1 ? 'justify-between ' : 'justify-end']"
    v-if="productInCart.products.length"
  >
    <Button
      v-if="stepIndex > 1 && stepIndex < steps.length - 1"
      type="button"
      class="btn"
      @click="PrevStep()"
      >Revenir à l'étape précédente</Button
    >
    <Button
      v-if="stepIndex < steps.length - 1"
      type="button"
      class="btn"
      @click="NextStep()"
      :disabled="!selectedCarrier && (stepIndex === 3 || Number(route.query.step) === 3)"
      >Passer à l'étape suivante</Button
    >
  </div>
</template>
<style lang="css">
@import '@/assets/styles/order.css';
</style>
