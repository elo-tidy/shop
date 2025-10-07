<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'
// import { Form, FormControl, FormField, FormItem, FormLabel } from 'src/components/ui/form'

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

onBeforeMount(() => {
  loadStripe(stripeKey).then(async () => {
    stripeLoaded.value = true

    // Good place to call your backend to create PaymentIntent
    // Skipping to the point when you got client_secret
    const res = await fetch('/api/create-payment-intent', { method: 'POST' })
    const data = await res.json()
    clientSecret.value = data.client_secret
  })
})

async function handleSubmit() {
  // Confirm the PaymentIntent using the details collected by the Payment Element
  const stripeInstance = elementsComponent.value?.instance
  const elements = elementsComponent.value?.elements

  if (stripeInstance) {
    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: clientSecret.value,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
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
</script>
<template>
  <Form v-if="stripeLoaded" @submit.prevent="handleSubmit">
    <FormItem>
      <StripeElements
        :stripe-key="stripeKey"
        :instance-options="stripeOptions"
        :elements-options="elementsOptions"
        ref="elementsComponent"
      >
        <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
      </StripeElements>
    </FormItem>

    <button type="submit">Submit</button>
  </Form>
</template>
