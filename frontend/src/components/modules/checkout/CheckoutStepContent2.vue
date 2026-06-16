<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// Type
import type { StripeElementsOptionsMode, StripePaymentElementOptions } from '@stripe/stripe-js'
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
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'

// Global data : order - stripe
const orderStore = useOrderStore()
const { payment_intent, loadLastOrder, createOrder, resolveOrderPayment, syncCartWithOrder } =
  useOrderProcess()
const stripeStore = usePaymentStore()
const { initWithExistingPi } = stripeStore

const pI = ref<string | null>(null)

// Submit pay form
async function handleSubmit() {
  // Confirm the PaymentIntent using the details collected by the Payment Element
  const stripeInstance = elementsComponent.value?.instance
  const elements = elementsComponent.value?.elements

  if (!stripeInstance || !elements) return

  // Front Stripe form error
  const { error: submitError } = await elements.submit()
  if (submitError) {
    console.error('Erreur lors de la soumission des éléments Stripe:', submitError)
    return
  }

  // Stripe Metadata update
  await resolveOrderPayment()

  // Stripe payment success
  if (stripeInstance) {
    const returned_url = 'http://localhost:5173/checkout'
    const { error } = await stripeInstance.confirmPayment({
      elements,
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
      console.error('Stripe error:', error.message)
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }
}

// Stripe elements
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
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
  fields: {
    billingDetails: {
      address: {
        country: 'never',
      },
    },
  },
})
const clientSecretRef = ref<string | null>(null)

// Define component refs
const elementsComponent = ref()

// Load Stripe if needed
async function initStripe() {
  await loadStripe(stripeKey)
  stripeStore.setStripeLoaded(true)
}

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
    const session = useSupabaseSession()
    const userId = session.session.value?.user.id
    if (!userId) return
    if (!bddOrder || !orderStore.orderModel?.data) {
      orderStore.initOrder(userId)
    }

    // Synchro between local and bdd cart
    await syncCartWithOrder()

    // Stripe init and paymentIntent
    await initStripe()
    const payment = await resolveOrderPayment()
    clientSecretRef.value = payment.clientSecret
    const paymentIntentId = payment.paymentIntentId
    pI.value = paymentIntentId

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
  <StripeElements
    v-if="stripeStore.stripeLoaded && clientSecretRef"
    :key="clientSecretRef"
    :stripe-key="stripeKey"
    :elements-options="elementsOptions"
    ref="elementsComponent"
  >
    <StripeElement type="payment" :options="paymentElementOptions" />
  </StripeElements>

  <Button v-if="!payment_intent" type="button" @click="handleSubmit">Payer</Button>
</template>
