<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// Type
import type { CartProduct, CartType, Order, CartBackEndType } from '@/types/Cart'
import type {
  Stripe,
  StripeElementsOptionsMode,
  StripePaymentElementOptions,
} from '@stripe/stripe-js'
import type { DeliveryDetails } from '@/types/ShippingMode'
// UI
import Button from '@/components/ui/button/Button.vue'
import { toast } from 'vue-sonner'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
import { useDeliveryDetails } from '@/composables/useDeliveryDetails'
// Utils
import { priceFromEurosToCents } from '@/utils/maths'
// Service
// import { getConfirmedPayment } from '../../../../../shared/services/StripeServices'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { usePaymentStore } from '@/store/StripeStore'
// Api
import { addOrder } from '@/api/order'
import { resolvePaymentIntent } from '@/api/payment'

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
  // updatePaymentOrder,
  currentOrder,
  localOrder,
  createOrderFromCart,
  resetOrder,

  deleteOrder,
} = useOrderProcess()

const stripeStore = usePaymentStore()

const route = useRoute()

// Cart
// const cartDetail: CartType = { products: effectiveOrder.value.carts[0].products }
const currentTotalPrice = effectiveOrder.value.total_price
const amount = priceFromEurosToCents(currentTotalPrice)
const cartDetail: CartType = {
  products: effectiveOrder.value.carts.products.map((p: CartProduct) => ({
    id: p.product_id,
    title: p.title,
    price: p.price,
    description: p.description ?? '',
    image: p.image,
    category: p.category,
    quantity: p.quantity,
  })),
}
// Pay button clic
const stripeResponse = ref(null)
async function handleSubmit() {
  if (!effectiveOrder.value || !effectiveOrder.value.carts) {
    console.error('Aucune commande disponible pour créer le panier.')
    toast('Le panier n’est pas encore chargé. Merci de réessayer.')
    return
  }

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
  const orderId = effectiveOrder.value.id
  const currency = 'eur'
  const cartId = effectiveOrder.value.carts.id
  const userId = effectiveOrder.value.user_id
  const paymentIntentId = effectiveOrder.value.payment_ID
  await resolvePayment(orderId, amount, currency, cartId, userId, paymentIntentId)

  // Stripe payment success
  if (stripeInstance) {
    const returned_url = 'http://localhost:5173/checkout'
    // const { error } = await getConfirmedPayment(
    //   stripeInstance,
    //   elements,
    //   clientSecretRef.value,
    //   returned_url,
    // )
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
const clientSecretRef = ref<string | null>('')
const paymentIntentIdRef = ref<string | null>('')

// Define component refs
const elementsComponent = ref()
const paymentComponent = ref()

const stepStore = usecheckoutStepper()
const cartStore = useCartStore()

async function initStripe() {
  await loadStripe(stripeKey)
  // stripeLoaded.value = true
  stripeStore.setStripeLoaded(true)
}

async function loadLastBddOrder(): Promise<Order | null> {
  try {
    const order = await loadLastOrder()
    console.log('Commande trouvée en BDD :', order)
    return order
  } catch (error) {
    console.error('Erreur récupération commande :', error)
    return null
  }
}
async function createOrder(cartDetail: CartType, paymentIntentId: string): Promise<Order | null> {
  const orderDetail: CartBackEndType = {
    products: cartDetail.products,
    payment_intent_ID: paymentIntentId,
    delivery_carrier_id: stepStore.livraisonDetails.transporter.id,
  }

  const inserted = await addOrder(orderDetail)

  if (!inserted) {
    throw new Error('Insertion commande échouée')
  }

  console.log('Commande insérée avec PaymentIntent 1:', paymentIntentId)

  return await loadLastOrder()
}

const mapOrder = (order: Order) => {
  return {
    delivery_carrier: order.delivery_carrier,
    products: order.carts.products.map((p: CartProduct) => ({
      productId: p.id,
      productQty: p.quantity,
      productPrice: p.price,
    })),
  }
}

async function syncCartWithOrder(bddOrder: Order | null) {
  if (!bddOrder) return

  // const mappedLocalCart = mapOrder(cartStore.cart.products, carrierName.value)
  const mappedLocalCart = mapOrder(localOrder.value)
  const mappedBddOrder = mapOrder(bddOrder)
  const isOrderIdentical = JSON.stringify(mappedLocalCart) === JSON.stringify(mappedBddOrder)

  console.log('local', mappedLocalCart)
  console.log('bdd', mappedBddOrder)

  if (isOrderIdentical) {
    console.log('Panier identique, pas de réinitialisation')
    return
  }

  console.log('Panier différent, réinitialisation nécessaire')

  await resetOrder()
  await createOrder(localOrder.value.carts, localOrder.value.payment_ID)

  console.log('Panier réinitialisé')
}

const resolvePayment = async (
  orderId: string,
  amount: number,
  currency: string,
  cartId: string,
  userId: string,
  paymentIntentId?: string,
) => {
  return await resolvePaymentIntent({
    orderId: orderId,
    amount: amount,
    currency: currency,
    paymentIntentId: paymentIntentId,
    metadata: {
      orderId: orderId,
      cartId: cartId,
      userId: userId,
    },
  })
}

onBeforeMount(async () => {
  // Etape de confirmation si succes de paiement
  if (route.query.redirect_status === 'succeeded') {
    stepStore.incrementStep(2)
    stepStore.validStep(3)
    return
  }

  try {
    if (!stepStore || !cartStore) return

    let bddOrder = await loadLastBddOrder()

    await initStripe()

    const currentOrder = bddOrder

    const cartDetail: CartType = {
      products: effectiveOrder.value.carts.products.map((p: CartProduct) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description ?? '',
        image: p.image,
        category: p.category,
        quantity: p.quantity,
      })),
    }
    const orderId = effectiveOrder.value.id
    const currency = 'eur'
    const cartId = effectiveOrder.value.carts.id
    const userId = effectiveOrder.value.user_id

    const paymentIntentId = bddOrder?.payment_ID ?? stripeStore.paymentIntentId ?? undefined
    const payment = await resolvePayment(orderId, amount, currency, cartId, userId, paymentIntentId)

    clientSecretRef.value = payment.clientSecret
    paymentIntentIdRef.value =
      bddOrder?.payment_ID ?? stripeStore.paymentIntentId ?? payment.paymentIntentId ?? undefined

    if (!currentOrder) {
      bddOrder = await createOrder(cartDetail, payment.paymentIntentId)
    }
    await syncCartWithOrder(bddOrder)
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
    <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
  </StripeElements>

  <Button v-if="!payment_intent" type="button" @click="handleSubmit">Payer</Button>
</template>
