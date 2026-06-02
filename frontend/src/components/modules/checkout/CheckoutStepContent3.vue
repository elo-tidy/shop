<script setup lang="ts">
import { onMounted, computed, onBeforeMount, ref } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
// Store
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { usePaymentStore } from '@/store/StripeStore'
import { useProductStore } from '@/store/ProductStore'
// Utils
import { stripePromise } from '@/utils/stripe'
import { priceFromEurosToCents } from '@/utils/maths'
// Api
import { resolvePaymentIntent } from '@/api/payment'

/**
 * Data : order detail - delivery
 */
const route = useRoute()

// Data Order details
const {
  payment_intent,
  payment,
  // formattedDate,
  effectiveOrder,
  deliveryDetails,
  deliveryDate,
  loading,
  error,
  currentOrder,
  // updatePaymentOrder,
  loadLastOrder,
} = useOrderProcess()

// Data delivery
const deliveryMode = computed(() => deliveryDetails.value?.deliveryMode)
const shippingDate = computed(() => deliveryDate.value)
const formattedDate = new Date(effectiveOrder.value.created_at).toLocaleString('fr-FR')

// Payment status
const stripePaymentReturn = ref<{ state: string; message: string }>({
  state: 'loading',
  message: 'Validation du paiement en cours',
})
const displayDetailsOrder = ref(false)

onBeforeMount(async () => {
  await loadLastOrder()
})

// Update order payment status to paid after payment_intent - load order details
const stepper = usecheckoutStepper()
const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const productStore = useProductStore()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const clientSecret = urlParams.get('payment_intent_client_secret')

  const stripe = await stripePromise

  if (!stripe) {
    console.error('Stripe failed to initialize')
    return
  }

  if (!clientSecret) {
    console.error('clientSecret missing')
    return
  }

  const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret)

  if (error) {
    console.error('Stripe error:', error)
    return
  }

  switch (paymentIntent.status) {
    case 'succeeded':
      stripePaymentReturn.value = {
        state: 'success',
        message: '',
      }
      displayDetailsOrder.value = true
      break

    case 'processing':
      stripePaymentReturn.value = {
        state: 'processing',
        message: 'Paiement en cours de traitement...',
      }
      break

    default:
      stripePaymentReturn.value = {
        state: paymentIntent.status,
        message: 'Paiement échoué',
      }
  }

  if (route.query.redirect_status === 'succeeded') {
    cartStore.clearCartStore()
    paymentStore.resetPayment()
    currentOrder.value = await loadLastOrder('paid')
  }
})

// Reset StepStore before route leaving - reset local order

onBeforeRouteLeave(async () => {
  if (route.query.redirect_status === 'succeeded') {
    stepper.resetStepper()
    currentOrder.value = await loadLastOrder()
  }
})
</script>

<template>
  <!-- statut du paiement -->
  <div v-if="stripePaymentReturn.state === 'processing'" :class="stripePaymentReturn.state">
    <p>{{ stripePaymentReturn.message }}</p>
  </div>

  <div v-if="displayDetailsOrder">
    <p>Merci pour votre commande !</p>

    <h3 class="text-[18px] mt-5">Détails de la commande :</h3>
    <div class="mt-2">
      <p><strong>Commande numéro :</strong> {{ effectiveOrder?.id }}</p>
      <p><strong>Date :</strong> {{ formattedDate }}</p>
      <p><strong>Montant :</strong> {{ effectiveOrder?.total_price }} €</p>
      <p><strong>Moyen de paiement :</strong> {{ effectiveOrder?.payment_method }}</p>
      <p><strong>Paiement n°:</strong> {{ effectiveOrder.payment_ID }}</p>
    </div>

    <h3 class="text-[18px] mt-5">Modalités de livraison :</h3>
    <div class="mt-2">
      <p><strong>Mode de livraison :</strong> {{ deliveryMode }}</p>
      <p><strong>Transporteur :</strong> {{ effectiveOrder.delivery_carrier }}</p>
      <p>
        <strong>Frais de transport :</strong>
        {{ effectiveOrder.delivery_price }} €
      </p>
      <p><strong>Livraison estimée le :</strong> {{ shippingDate }}</p>
    </div>
  </div>
</template>
