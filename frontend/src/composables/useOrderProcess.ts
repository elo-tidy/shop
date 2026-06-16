import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useSupabaseSession } from './useSupabaseSession'

// Stores
import { useCartStore } from '@/store/CartStore'
import { useOrderStore } from '@/store/OrderStore'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { usePaymentStore } from '@/store/StripeStore'

// Services
import {
  addOrder,
} from '@/api/order'

import {
  getOrderService,
  deleteOrderFromBdd,
} from '../../../shared/services/SupabaseServices'

import {
  resolvePaymentIntent
} from '@/api/payment'

import { stripePromise } from '@/utils/stripe'

import type { cartProduct, CartType, Order } from '@/types/Cart'
import type { Transporter } from '@/types/ShippingMode'
import type { productCatalog } from '@/types/Product'

/* -------------------------------------------------- */
/* STATE                                              */
/* -------------------------------------------------- */

export function useOrderProcess() {

  const route = useRoute()

  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const stepStore = usecheckoutStepper()
  const paymentStore = usePaymentStore()

  // States
  const loading = ref(false)
  const error = ref(false)
  const payment_intent = String(route.query.payment_intent || '')

  // Order displays ans mutations
  async function loadLastOrder(
    payment_status?: 'paid'
  ): Promise<Order | null> {
    try {
      const order = await getOrderService(payment_status)
      if (!order) return null
      orderStore.setOrder(order)
      return order
    } catch (err) {
      console.error(err)
      error.value = true
      return null
    }
  }
  async function createOrder(
    cart: CartType,
    carrierId: Transporter["id"],
    paymentIntentId: string
  ): Promise<Order> {

    const order = await addOrder({
      products: cart.products,
      payment_ID: paymentIntentId,
      // delivery_carrier: orderStore.getdeliveryDetails.transporter.id,
      delivery_carrier: carrierId,
    })
    if (!order) throw new Error('Order creation failed')

      console.log('Order created:', order)

    orderStore.setOrder(order)

    return order
  }
  async function deleteOrder(orderId: Order['id']) {
    try {
      return await deleteOrderFromBdd(orderId)
    } catch (err) {
      console.error(err)
      error.value = true
      return false
    }
  }
  async function resetOrder(order?: Order | null) {

    const last = order ?? await loadLastOrder()
    if (!last) return false
    const paymentStore = usePaymentStore()

    if (
      !paymentStore.paymentIntentId &&
      last.payment_ID
    ) {
      paymentStore.initWithExistingPi(last.payment_ID)
    }

    const current = orderStore.orderModel
    if (!current) return false
    const deleted = await deleteOrder(current.data.id)

    if (!deleted) {
      throw new Error('Order deletion failed')
    }
    orderStore.resetOrderDraft()

    return true
  }

  // Stripe payment
  async function resolveOrderPayment() {
    const order = orderStore.orderModel?.data
    const amount = orderStore.totalPriceInCents
    if (!order) throw new Error('Order missing')

    const payload = {
      orderId: order.id ?? '',
      cartId: order.cart_id,
      userId: order.user_id,
      paymentIntentId: order.payment_ID ?? '',
      amount: amount,
      currency: 'eur',
      // metadata: {
      //   orderId: order.id,
      //   cartId: order.cart_id,
      //   userId: order.user_id,
      // },
    }
    
    orderStore.setOrder(order)
    
    return await resolvePaymentIntent(payload)
  }
  async function verifyStripePayment(clientSecret: string) {
    const stripe = await stripePromise
    if (!stripe) return null
    return await stripe.retrievePaymentIntent(clientSecret)
  }
  async function confirmPaidOrder() {
    const data = await loadLastOrder('paid')
    if(!data) return
    orderStore.setOrder(data)
    return data
  }

  // Map Orders to compare
  function mapOrder(order: Order | {delivery_carrier: string, cart:CartType}) {
    return {
      delivery_carrier: order.delivery_carrier,
      products: order.cart.products.map((p:cartProduct) => ({
        id: p.id,
        quantity: p.quantity,
      })),
    }
  }
  async function syncCartWithOrder() {

    // Get transporter
    const transporterId = orderStore.deliveryDetails?.transporter?.id
    if (!transporterId) {
      throw new Error('Missing transporter before order creation')
    }

    // Get local - bdd order and compare
    const bddOrder = await loadLastOrder()
    const localOrder = {
      delivery_carrier: transporterId,
      cart: cartStore.cart
    }
    if(!bddOrder) return
   
    const mappedBdd = mapOrder(bddOrder)
    const mappedLocal = mapOrder(localOrder)
    const isIdentical = JSON.stringify(mappedLocal) === JSON.stringify(mappedBdd)    
    if (isIdentical) return

    // If bdd and local order are different, re-create order
    await resetOrder(bddOrder)
    await createOrder(
      cartStore.cart,
      transporterId,
      paymentStore.paymentIntentId!
    )
  }

  return {
    loading,
    error,
    payment_intent,
    loadLastOrder,
    createOrder,
    deleteOrder,
    resetOrder,
    resolveOrderPayment,
    verifyStripePayment,
    confirmPaidOrder,
    syncCartWithOrder,
  }
}