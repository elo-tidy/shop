<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
// Types
import type { Order } from '@shared/types/Cart'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
import { convertISOtoDateFR } from '@shared/composables/useDeliveryEstimation'
// Store
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useCartStore } from '@/store/CartStore'
import { usePaymentStore } from '@/store/StripeStore'
import { useOrderStore } from '@/store/OrderStore'

// Data Order details
const { verifyStripePayment, confirmPaidOrder } = useOrderProcess()

// Data delivery
const orderStore = useOrderStore()

// Payment status
const stripePaymentReturn = ref<{ state: string; message: string }>({
  state: 'loading',
  message: 'Validation du paiement en cours',
})
const displayDetailsOrder = ref(false)
const paidOrder = ref<Order | null>(null)

// Update order payment status to paid after payment_intent - load order details
const stepper = usecheckoutStepper()
const cartStore = useCartStore()
const paymentStore = usePaymentStore()

const route = useRoute()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const clientSecret = urlParams.get('payment_intent_client_secret')

  if (!clientSecret) {
    console.error('clientSecret missing')
    return
  }

  const result = await verifyStripePayment(clientSecret)
  if (!result?.paymentIntent) return

  switch (result.paymentIntent?.status) {
    case 'succeeded':
      stripePaymentReturn.value = {
        state: 'success',
        message: '',
      }
      displayDetailsOrder.value = true

      // Load last paid order and reload order store
      const data = await confirmPaidOrder()
      if (!data) throw new Error('Order not found')
      paidOrder.value = data

      // Clear cart and reload with paid order products
      cartStore.clearCartStore()
      const paidProducts = computed(() => paidOrder.value?.cart.products ?? [])
      paidProducts.value.forEach((product: Order['cart']['products'][number]) => {
        cartStore.addToCart(product, product.quantity)
      })

      // Reset StripeStore
      paymentStore.resetPayment()
      break

    case 'processing':
      stripePaymentReturn.value = {
        state: 'processing',
        message: 'Paiement en cours de traitement...',
      }
      break

    default:
      stripePaymentReturn.value = {
        state: result.paymentIntent?.status ?? 'failed',
        message: 'Paiement échoué',
      }
  }
})

// Reset StepStore before route leaving - reset local order
onBeforeRouteLeave(async () => {
  if (route.query.redirect_status === 'succeeded') {
    stepper.resetStepper()
    orderStore.clearOrder()
    cartStore.clearCartStore()
  }
})
</script>

<template>
  <div v-if="stripePaymentReturn.state === 'processing'" :class="stripePaymentReturn.state">
    <p>{{ stripePaymentReturn.message }}</p>
  </div>

  <div v-if="displayDetailsOrder && paidOrder">
    <h3 class="text-[18px] underline">Détails de la commande :</h3>
    <div class="mt-2">
      <p>
        <strong>Commande numéro :</strong>
        {{ paidOrder.id }}
      </p>
      <p><strong>Date :</strong> {{ convertISOtoDateFR(paidOrder.created_at) }}</p>
      <p><strong>Montant :</strong> {{ paidOrder.total_price }} €</p>
      <p><strong>Moyen de paiement :</strong> {{ paidOrder.payment_method }}</p>
      <p><strong>Paiement n°:</strong> {{ paidOrder.payment_ID }}</p>
    </div>

    <h3 class="text-[18px] mt-5 underline">Modalités de livraison :</h3>
    <div class="mt-2">
      <p><strong>Mode de livraison :</strong> {{ orderStore.deliveryDetails?.deliveryMode }}</p>
      <p><strong>Transporteur :</strong> {{ paidOrder.delivery_carrier }}</p>
      <p>
        <strong>Livraison estimée le :</strong> {{ convertISOtoDateFR(paidOrder.delivery_date) }}
      </p>
    </div>
  </div>
</template>
