<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// Types
import type { PaymentIntentResponse, PaymentDetails } from '@/types/stripe'
// Stripe
import { loadStripe } from '@stripe/stripe-js'
// Utils
import { priceFromCentsToEuros } from '@/utils/maths'
// Service
import { fetchPaymentDetails } from '@/services/StripeServices'

const payment_intent: string = String(useRoute().query.payment_intent)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const payment = ref<PaymentDetails | null>(null)
const error = ref<boolean>(false)
const loading = ref<boolean>(true)
const formattedDate = ref()
const price = (price: number): string => {
  return priceFromCentsToEuros(price)
}
const paymentMethod = () => {
  return payment?.value?.payment_method_types[0] === 'card' ? 'Carte bancaire' : 'test'
}

onMounted(async () => {
  loadStripe(stripeKey).then(async () => {
    if (!payment_intent) {
      console.error('payment_intent non défini !')
      loading.value = false
      return
    }

    try {
      const res = await fetchPaymentDetails(payment_intent)
      payment.value = res
      formattedDate.value = new Date(res.created * 1000).toLocaleString('fr-FR')
    } catch (err) {
      console.error('Erreur lors de la récupération du PaymentIntent :', err)
      error.value = true
    } finally {
      loading.value = false
    }
  })
})
</script>

<template>
  <div v-if="loading">Chargement...</div>

  <div v-else-if="error" class="error">
    <p>Une erreur est survenue : {{ error }}</p>
  </div>

  <div v-else class="success">
    <p>Merci pour votre commande !</p>
    <h3 class="text-[18px] mt-5">Détails de la commande :</h3>
    <div class="mt-2" v-if="payment">
      <p><strong>Commande numéro :</strong> {{ payment?.id }}</p>
      <p><strong>Date :</strong> {{ formattedDate }}</p>
      <p><strong>Montant :</strong> {{ price(payment?.amount) }} €</p>
      <p><strong>Paiement :</strong> {{ paymentMethod() }}</p>
    </div>
  </div>
</template>
