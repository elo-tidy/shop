<script setup lang="ts">
import { onBeforeMount, ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
// Type
import type {
  StripeElements,
  StripePaymentElement,
  StripeElementsOptionsMode,
  StripePaymentElementOptions,
} from '@stripe/stripe-js'
// UI
import Button from '@/components/ui/button/Button.vue'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
import { useSupabaseSession } from '@/composables/useSupabaseSession'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { useOrderStore } from '@/store/OrderStore'
import { usePaymentStore } from '@/store/StripeStore'

// Stripes
import { stripePromise } from '@/utils/stripe'

// Global data : order - stripe
const orderStore = useOrderStore()
const { payment_intent, loadLastOrder, createOrder, resolveOrderPayment, syncCartWithOrder } =
  useOrderProcess()
const stripeStore = usePaymentStore()

const pI = ref<string | null>(null)
const paymentError = ref<string | null>(null)

// Submit pay form
async function handleSubmit() {
  paymentError.value = null

  const stripe = await stripePromise
  if (!stripe || !elements.value) {
    paymentError.value = 'Le formulaire de paiement n’est pas prêt.'
    return
  }
  if (!clientSecretRef.value) {
    paymentError.value = 'Le paiement n’est pas prêt.'
    return
  }

  // Front Stripe form error
  const { error: submitError } = await elements.value.submit()
  if (submitError) {
    paymentError.value = submitError.message ?? 'Erreur dans le formulaire de paiement.'
    return
  }

  try {
    // Stripe Metadata update
    await resolveOrderPayment()

    const returned_url = `${window.location.origin}/checkout`

    const { error } = await stripe.confirmPayment({
      elements: elements.value,
      clientSecret: clientSecretRef.value,
      confirmParams: {
        return_url: returned_url,
        payment_method_data: {
          billing_details: {
            address: {
              country: 'FR',
            },
          },
        },
      },
    })

    if (error) {
      paymentError.value = error.message ?? 'Le paiement a échoué.'
    }
  } catch (error) {
    console.error('Payment error:', error)
    paymentError.value = 'Une erreur est survenue lors du paiement.'
  }
}

// Stripe elements
const elements = ref<StripeElements | null>(null)
const paymentElement = ref<StripePaymentElement | null>(null)
const paymentElementContainer = ref<HTMLElement | null>(null)

const elementsOptions = computed<StripeElementsOptionsMode>(() => ({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options

  mode: 'payment',
  payment_method_types: ['card'],
  amount: orderStore.totalPriceInCents,
  currency: 'eur',
  appearance: {
    theme: 'night',
    variables: {
      colorBackground: '#0c0a0a',
      colorPrimary: '#facc15',
      accessibleColorOnColorPrimary: '#0c0a0a',
      colorText: 'white',
      colorTextSecondary: 'white',
      colorTextPlaceholder: '#ABB2BF',
      tabIconColor: 'white',
      logoColor: 'dark',
    },
  },
}))
const paymentElementOptions = ref<StripePaymentElementOptions>({
  // https://docs.stripe.com/js/elements_object/create_payment_element#payment_element_create-options
  layout: {
    type: 'auto',
    radios: 'if_multiple',
  },
  fields: {
    billingDetails: {
      address: {
        country: 'never',
      },
    },
  },
})
const clientSecretRef = ref<string | null>(null)

async function initStripePaymentElement() {
  if (!clientSecretRef.value) return

  const stripe = await stripePromise

  if (!stripe) {
    throw new Error('Stripe n’a pas pu être chargé')
  }
  if (!paymentElementContainer.value) {
    throw new Error('Conteneur Stripe introuvable')
  }
  if (paymentElement.value) return

  const stripeElements = stripe.elements(elementsOptions.value)

  elements.value = stripeElements

  const element = stripeElements.create('payment', paymentElementOptions.value)

  paymentElement.value = element

  element.mount(paymentElementContainer.value)
}

const session = useSupabaseSession()

const route = useRoute()
const stepStore = usecheckoutStepper()
const cartStore = useCartStore()
onBeforeMount(async () => {
  // Payment succeeded
  if (route.query.redirect_status === 'succeeded') {
    stepStore.incrementStep(2)
    stepStore.validStep(3)
    return
  }

  try {
    if (!stepStore || !cartStore || !orderStore.deliveryDetails) return

    let bddOrder = await loadLastOrder()

    // init local order
    const userId = session.session.value?.user.id
    if (!userId) return
    if (!bddOrder || !orderStore.orderModel?.data) {
      orderStore.initOrder(userId)
    }

    // Synchro between local and bdd cart
    await syncCartWithOrder()

    stripeStore.setStripeLoaded(true)
    const payment = await resolveOrderPayment()
    clientSecretRef.value = payment.clientSecret
    const paymentIntentId = payment.paymentIntentId
    pI.value = paymentIntentId

    await nextTick()
    await initStripePaymentElement()

    // create bdd order
    if (!bddOrder) {
      bddOrder = await createOrder(
        cartStore.cart,
        orderStore.deliveryDetails.transporter.id,
        paymentIntentId,
      )
    }
  } catch (e) {
    console.error('Checkout init error:', e)
  }
})
</script>
<template>
  <p
    v-if="paymentError"
    role="alert"
    class="mt-4 rounded-md border border-red-400 bg-red-400/10 p-3 text-sm text-red-400"
  >
    {{ paymentError }}
  </p>

  <div v-if="stripeStore.stripeLoaded && clientSecretRef" ref="paymentElementContainer"></div>
  <Button v-if="!payment_intent && clientSecretRef" type="button" @click="handleSubmit"
    >Payer</Button
  >
</template>
