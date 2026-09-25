<script setup lang="ts">
import { ref } from 'vue'
// Data
import stripeData from '@/data/stripe-test-cards.json'
// Components
import Button from '@/components/ui/button/Button.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StripeTestCard {
  id: string
  label: string
  description: string
  number: string
}

interface StripeTestData {
  cards: StripeTestCard[]
  fields: {
    expiry: {
      label: string
      description: string
    }
    cvc: {
      label: string
      value: string
      description: string
    }
  }
}

const selectedCard = ref<StripeTestCard | null>(null)
const copied = ref<string | null>(null)

function generateExpiryDate() {
  const date = new Date()

  date.setFullYear(date.getFullYear() + 1)

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  return `${month}/${year}`
}

const expiry = generateExpiryDate()
const cvc = stripeData.fields.cvc.value

async function copy(value: string, field: string) {
  await navigator.clipboard.writeText(value)

  copied.value = field

  setTimeout(() => {
    copied.value = null
  }, 1200)
}
</script>

<template>
  <p>Sélectionnez une carte pour tester le formulaire de paiement :</p>
  <Tabs>
    <TabsList
      class="gap-2 h-full *:border-primary/20 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] w-full"
    >
      <TabsTrigger
        v-for="card in stripeData.cards"
        :key="card.id"
        :value="card.label"
        class="flex p-2 text-xs hover:border-primary"
      >
        <span class="w-full whitespace-normal text-foreground">{{ card.label }}</span>
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="card in stripeData.cards"
      :key="card.id"
      :value="card.label"
      class="@container"
    >
      <dl class="grid @md:grid-cols-[150px_1fr] grid-cols-1 *:mb-2 mt-4 items-center">
        <!-- Card number -->
        <dt class="block text-sm font-medium">{{ stripeData.fields.number.label }} :</dt>
        <dd class="flex items-center justify-between rounded-lg border px-3 py-2 h-11">
          <code class="font-mono text-sm">
            {{ card.number }}
          </code>
          <Button
            type="button"
            class="text-xs py-0 font-medium h-6"
            @click="copy(card.number, 'number')"
          >
            <span v-if="copied === 'number'" class="sr-only"
              >{{ stripeData.fields.number.label }}
            </span>
            {{ copied === 'number' ? 'Copié' : 'Copier' }}
            <span v-if="copied !== 'number'" class="sr-only"
              >le {{ stripeData.fields.number.label }}</span
            >
          </Button>
        </dd>

        <!-- Expiration -->
        <dt class="block text-sm font-medium">{{ stripeData.fields.expiry.label }} :</dt>
        <dd class="flex items-center justify-between rounded-lg border px-3 py-2 h-11">
          <code class="font-mono text-sm">
            {{ expiry }}
          </code>

          <Button type="button" class="text-xs font-medium h-6" @click="copy(expiry, 'expiry')">
            <span v-if="copied === 'expiry'" class="sr-only"
              >{{ stripeData.fields.expiry.label }}
            </span>
            {{ copied === 'expiry' ? 'Copiée' : 'Copier' }}
            <span v-if="copied !== 'expiry'" class="sr-only"
              >la {{ stripeData.fields.expiry.label }}</span
            >
          </Button>
        </dd>

        <!-- CVC -->
        <dt class="block text-sm font-medium">{{ stripeData.fields.cvc.label }} :</dt>
        <dd class="flex items-center justify-between rounded-lg border px-3 py-2 h-11">
          <code class="font-mono text-sm">
            {{ cvc }}
          </code>

          <Button type="button" class="text-xs font-medium h-6" @click="copy(cvc, 'cvc')">
            <span v-if="copied === 'cvc'" class="sr-only">{{ stripeData.fields.cvc.label }} </span>
            {{ copied === 'cvc' ? 'Copié' : 'Copier' }}
            <span v-if="copied !== 'cvc'" class="sr-only"
              >le {{ stripeData.fields.cvc.label }}</span
            >
          </Button>
        </dd>
      </dl>
    </TabsContent>
  </Tabs>
</template>
