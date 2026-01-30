<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// Type
import type { CartType, Order } from '@/types/Cart'
import type { StripeElementsOptionsMode, StripePaymentElementOptions } from '@stripe/stripe-js'
import type { DeliveryDetails } from '@/types/ShippingMode'
// UI
import Button from '@/components/ui/button/Button.vue'
import { toast } from 'vue-sonner'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
// Utils
import { priceFromEurosToCents } from '@/utils/maths'
// Service
import {
  fetchPaymentIntents,
  getConfirmedPayment,
  fetchPaymentDetails,
} from '../../../../../shared/services/StripeServices'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { usePaymentStore } from '@/store/StripeStore'

// Stripes
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'

/**
 * Data : orderProcess - cart
 */

// Insert order process
const {
  insertOrder,
  effectiveOrder,
  payment_intent,
  loadLastOrder,
  updatePaymentOrder,
  currentOrder,
  createOrderFromCart,
  resetOrder,

  deleteOrder,
} = useOrderProcess()

// Cart
// const cartDetail: CartType = { products: effectiveOrder.value.carts[0].carts_products }
const currentTotalPrice = effectiveOrder.value.total_price
const amount = priceFromEurosToCents(currentTotalPrice)

// Pay button clic
async function handleSubmit() {
  console.log('handleSubmit ', effectiveOrder.value)
  if (!effectiveOrder.value || !effectiveOrder.value.carts) {
    console.error('Aucune commande disponible pour créer le panier.')
    toast('Le panier n’est pas encore chargé. Merci de réessayer.')
    return
  }

  // Map cart before inserting in bdd
  /*const cartDetail: CartType = {
    products: effectiveOrder.value.carts.carts_products.map((p) => ({
      id: p.product_id,
      title: p.title,
      price: p.price,
      description: p.description ?? '',
      image: p.image,
      category: p.category,
      quantity: p.quantity,
    })),
  }
  // Insert order in bdd, stop stripe if not
  const orderIsInserted = await insertOrder(cartDetail)
  if (!orderIsInserted) {
    console.error("La commande n'a pas été insérée, paiement stoppé.")
    toast(
      'Une erreur est survenue lors de l’enregistrement de votre commande. Votre paiement n’a pas été effectué. Merci de réessayer ou de nous contacter',
    )
    return
  }*/

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

  // Stripe payment success
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

// Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripeOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
})
const elementsOptions = ref<StripeElementsOptionsMode>({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options

  mode: 'payment',
  payment_method_types: ['card'],
  amount: amount,
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
const paymentIntentIdRef = ref<string | null>('')

// Define component refs
const elementsComponent = ref()
const paymentComponent = ref()

const stepStore = usecheckoutStepper()
const cartStore = useCartStore()
onBeforeMount(async () => {
  try {
    await loadStripe(stripeKey)
    stripeLoaded.value = true
  } catch (error) {
    console.error('Erreur chargement Stripe :', error)
    return
  }

  if (!effectiveOrder.value || !effectiveOrder.value.carts) return

  const cartDetail: CartType = {
    products: effectiveOrder.value.carts.carts_products.map((p) => ({
      id: p.product_id,
      title: p.title,
      price: p.price,
      description: p.description ?? '',
      image: p.image,
      category: p.category,
      quantity: p.quantity,
    })),
  }

  let bddOrder: Order | null = null
  try {
    bddOrder = await loadLastOrder()
  } catch (error) {
    console.error('Erreur récupération commande :', error)
  }

  const paymentStore = usePaymentStore()

  if (bddOrder?.payment_ID && !paymentStore.paymentIntentId) {
    paymentStore.paymentIntentId = bddOrder.payment_ID
    paymentIntentIdRef.value = bddOrder.payment_ID
    console.log('PaymentIntent existant trouvé en BDD :', paymentIntentIdRef.value)
  }

  if (paymentStore.paymentIntentId) {
    try {
      const paymentIntent = await fetchPaymentDetails(paymentStore.paymentIntentId)
      clientSecretRef.value = paymentIntent.client_secret
      paymentIntentIdRef.value = paymentStore.paymentIntentId
      console.log('PaymentIntent existant réutilisé :', paymentIntentIdRef.value)
    } catch (error) {
      console.error('Erreur récupération PaymentIntent existant :', error)
      return
    }
  } else {
    try {
      const { clientSecret, paymentIntentId } = await fetchPaymentIntents(
        priceFromEurosToCents(effectiveOrder.value.total_price),
        effectiveOrder.value.id,
        effectiveOrder.value.user_id,
        effectiveOrder.value.carts.id,
        //bddOrder?.id, // metadata
      )

      paymentStore.paymentIntentId = paymentIntentId
      paymentIntentIdRef.value = paymentIntentId
      clientSecretRef.value = clientSecret

      console.log('Nouveau PaymentIntent créé :', paymentIntentId)
    } catch (error) {
      console.error('Erreur création PaymentIntent :', error)
      return
    }
  }

  if (!bddOrder) {
    try {
      const inserted = await insertOrder(cartDetail, paymentIntentIdRef.value!)
      if (!inserted) return
      bddOrder = await loadLastOrder()
      console.log('Commande insérée avec PaymentIntent :', paymentIntentIdRef.value)
    } catch (error) {
      console.error('Erreur insertion commande :', error)
      return
    }
  }

  let isOrderIdentical
  try {
    if (Number(cartStore.getOrderPrice) === effectiveOrder.value.total_price) {
      isOrderIdentical = false
      console.log('Panier identique, pas de réinitialisation')
    } else {
      isOrderIdentical = true
      console.log('Panier différent, réinitialisation nécessaire')
    }
  } catch (error) {
    console.error('Erreur comparaison commande :', error)
  }

  if (isOrderIdentical) {
    try {
      await resetOrder()
      console.log('Panier réinitialisé')
    } catch (error) {
      console.error('Erreur réinitialisation commande :', error)
      return
    }
  }
})
onMounted(() => {
  const route = useRoute()
  // Valid current step - got to next step
  if (route.query.redirect_status === 'succeeded') {
    stepStore.incrementStep(2)
    stepStore.validStep(3)
  }
})
</script>
<template>
  <StripeElements
    v-if="stripeLoaded && clientSecretRef"
    :key="clientSecretRef"
    :stripe-key="stripeKey"
    :elements-options="elementsOptions"
    ref="elementsComponent"
  >
    <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
  </StripeElements>

  <Button v-if="!payment_intent" type="button" @click="handleSubmit">Payer</Button>
</template>
