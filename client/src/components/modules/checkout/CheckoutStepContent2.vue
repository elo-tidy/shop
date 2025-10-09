<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import Button from '@/components/ui/button/Button.vue'
import { useCartStore } from '@/store/CartStore'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useRoute } from 'vue-router'

import type { StripeElementsOptionsMode, StripePaymentElementOptions } from '@stripe/stripe-js'

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
const stripeLoaded = ref(false)
const clientSecret = ref('')

// Define component refs
const elementsComponent = ref()
const paymentComponent = ref()

// Total price in cents
const stepStore = usecheckoutStepper()
const currentDeliveryPrice: number = stepStore.getLivraisonDetails?.transporter.price ?? 0
const cartStore = useCartStore()
const currentTotalPrice: number = cartStore.getCartTotalPrice
const convertPriceInCents = (itemPrice: number, deliveryPrice: number): number => {
  return Math.round((itemPrice + deliveryPrice) * 100)
}

onBeforeMount(() => {
  loadStripe(stripeKey)
    .then(async () => {
      stripeLoaded.value = true
      // Good place to call your backend to create PaymentIntent
      // Skipping to the point when you got clientSecret
      const res = await fetch('/api/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: convertPriceInCents(currentDeliveryPrice, currentTotalPrice),
          items: cartStore.cart.products,
          currency: 'eur',
          payment_method_types: ['card'],
        }),
      })
      const data = await res.json()

      if (data.clientSecret) {
        clientSecret.value = data.clientSecret
      } else {
        console.error('Erreur : aucun clientSecret reçu depuis le serveur.')
      }

      clientSecret.value = data.clientSecret
    })
    .catch((error) => {
      console.error('Erreur lors du chargement de Stripe :', error)
    })
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
    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: clientSecret.value,
      confirmParams: {
        return_url: 'http://localhost:5173/checkout',
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
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      console.log(error)
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
    v-if="stripeLoaded && clientSecret != null && elementsOptions"
    :stripe-key="stripeKey"
    :instance-options="stripeOptions"
    :elements-options="elementsOptions"
    ref="elementsComponent"
  >
    <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
  </StripeElements>

  <Button type="button" @click="handleSubmit">Payer</Button>
</template>
