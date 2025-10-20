<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// UI
import Button from '@/components/ui/button/Button.vue'
// Stores
import { useCartStore } from '@/store/CartStore'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Stripes
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import type { StripeElementsOptionsMode, StripePaymentElementOptions } from '@stripe/stripe-js'
// Service
import { fetchPaymentIntents, getConfirmedPayment } from '@/services/StripeServices'
// Utils
import { priceFromEurosToCents } from '@/utils/maths'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripeOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
})
const elementsOptions = ref<StripeElementsOptionsMode>({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options

  mode: 'payment',
  payment_method_types: ['card'],
  amount: 1099,
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
})
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
const stripeLoaded = ref<boolean>(false)
const clientSecretRef = ref<string | null>('')

// Define component refs
const elementsComponent = ref()
const paymentComponent = ref()

// Total price in cents
const stepStore = usecheckoutStepper()
const currentDeliveryPrice: number = stepStore.getLivraisonDetails?.transporter.price ?? 0
const cartStore = useCartStore()
const currentTotalPrice: number = cartStore.getCartTotalPrice
const convertPriceInCents = (itemPrice: number, deliveryPrice: number): number => {
  return priceFromEurosToCents(itemPrice + deliveryPrice)
}
const amount: number = convertPriceInCents(currentDeliveryPrice, currentTotalPrice)

onBeforeMount(async () => {
  try {
    await loadStripe(stripeKey)
    stripeLoaded.value = true

    const { clientSecret } = await fetchPaymentIntents(amount, cartStore.cart.products)
    clientSecretRef.value = clientSecret
  } catch (error) {
    console.error('Erreur lors du chargement de Stripe ou de la création du PaymentIntent :', error)
  }
})

async function handleSubmit() {
  // Confirm the PaymentIntent using the details collected by the Payment Element
  const stripeInstance = elementsComponent.value?.instance
  const elements = elementsComponent.value?.elements

  if (!stripeInstance || !elements) return

  const { error: submitError } = await elements.submit()
  if (submitError) {
    console.error('Erreur lors de la soumission des éléments Stripe:', submitError)
    return
  }

  if (stripeInstance) {
    const returned_url = 'http://localhost:5173/checkout'
    const { error } = await getConfirmedPayment(
      stripeInstance,
      elements,
      clientSecretRef.value,
      returned_url,
    )

    if (error) {
      console.error('Stripe error:', error.message)
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }
}

onMounted(() => {
  const route = useRoute()
  if (route.query.redirect_status === 'succeeded') {
    stepStore.incrementStep(2)
    stepStore.validStep(3)
  }
})
</script>
<template>
  <StripeElements
    v-if="stripeLoaded && clientSecretRef"
    :stripe-key="stripeKey"
    :instance-options="stripeOptions"
    :elements-options="elementsOptions"
    ref="elementsComponent"
  >
    <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
  </StripeElements>

  <Button type="button" @click="handleSubmit">Payer</Button>
</template>
