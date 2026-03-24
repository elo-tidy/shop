import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Types
import type { CartType, Order, InsertCartProduct, Cart } from '@/typesold/Cart'
import type { DeliveryDetailsWrapper, Transporter, DeliveryDetails } from '@/typesold/ShippingMode'
import type { ProductApi } from '@/typesold/Product'
import type { Database } from '@/typesold/supabase'
// Stores
import { useCartStore } from '@/store/CartStore'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { usePaymentStore } from '@/store/StripeStore'
// Services
import { fetchPaymentDetails, fetchPaymentIntents } from '../../../shared/services/StripeServices'
import {
  inserOrderService,
  updatePaymentOrderService,
  getOrderService,
  getCarrierDetails,
  deleteOrderFromBdd,
  getUserProfile,
} from '../../../shared/services/SupabaseServices'
// Composable
import {
  estimatedDelivery,
  convertDateFRtoISO,
} from '../../../shared/composables/useDeliveryEstimation'
import type { User } from '@supabase/supabase-js'

const currentOrder = ref<Order | null>(null)
const lastOrder = ref<Order | null>(null)
const deliveryDetails = ref<DeliveryDetails | null>(null)

export function useOrderProcess() {
  const route = useRoute()
  const cartStore = useCartStore()
  const stepStore = usecheckoutStepper()

  const payment = ref<any>(null)
  const formattedDate = ref('')

  // const currentOrder = ref<Order | null>(null)
  // const lastOrder = ref<Order | null>(null)
  // const deliveryDetails = ref<DeliveryDetails | null>(null)

  const error = ref(false)
  const loading = ref(false)
  const orderAlreadyInserted = ref(false)

  const payment_intent = String(route.query.payment_intent || '')

  const transporterInfo = computed<Transporter | null>(
    () => deliveryDetails.value?.transporter ?? null,
  )

  const deliveryDate = computed(() =>
    // estimatedDelivery(transporterInfo.value?.estimated_delivery_time ?? 0),
    estimatedDelivery(),
  )
  const userId = ref<Database['public']['Tables']['profiles']['Row']['id'] | undefined>('')
  async function loadUserId() {
    const profile = await getUserProfile()
    userId.value = profile.data.session?.user.id
    return userId.value
  }
  loadUserId()

  /** Computed pour gérer l’ordre effectif : BDD si dispo sinon store */
  const effectiveOrder = computed<Order>(() => {
    if (currentOrder.value) return currentOrder.value
    // if (lastOrder.value) return lastOrder.value

    // Génère un ordre basé sur le store
    const cart = cartStore.cart
    const delivery = stepStore.livraisonDetails
    return createOrderFromCart(cart, userId.value, delivery)
  })

  /** Charge la dernière commande depuis la BDD */
  async function loadLastOrder(): Promise<Order | null> {
    try {
      const order = await getOrderService()
      console.log('loadLastOrder', order)

      if (!order) {
        if (stepStore.livraisonDetails) {
          deliveryDetails.value = stepStore.livraisonDetails
        }
        return null
      }

      // BDD last order
      lastOrder.value = order
      currentOrder.value = order

      if (order.delivery_carrier) {
        const details = await getCarrierDetails(order.delivery_carrier)
        if (details) {
          const selectedMode = details.deliveryMode
          deliveryDetails.value = {
            transporter: details.transporter,
            deliveryMode: selectedMode?.name ?? 'Standard',
            deliveryModeId: selectedMode?.id ?? '',
          }
          stepStore.setLivraisonDetails(deliveryDetails.value)
        }
      }
      console.log('currentOrder mis à jour DANS composable', order)
      return order
    } catch (err) {
      console.error('Erreur loadLastOrder :', err)
      error.value = true
      return null
    }
  }

  //

  function createOrderFromCart(
    cart: CartType,
    userId?: Database['public']['Tables']['profiles']['Row']['id'],
    delivery?: DeliveryDetails | null,
  ): Order {
    const carts_products = cart.products.map((p) => ({
      cart_id: String(cart.id ?? 0),
      product_id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      image: p.image,
      category: p.category,
      quantity: p.quantity ?? 1,
    }))

    const productsPrice = cart.products.reduce((total, p) => {
      return total + p.price * (p.quantity ?? 1)
    }, 0)

    const { paymentIntentId } = usePaymentStore()
    const order = {
      id: '0',
      user_id: userId,
      cart_id: cart.id ?? '0',
      total_price: productsPrice + (delivery?.transporter?.price ?? 0),
      payment_status: 0,
      payment_method: 'Carte bancaire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      delivery_status: 0,
      delivery_price: delivery?.transporter?.price ?? 0,
      delivery_carrier: delivery?.transporter?.name ?? '',
      delivery_date: 'Non encore estimée 2',
      products_price: productsPrice,
      payment_ID: paymentIntentId,
      carts: {
        id: cart.id ?? '0',
        carts_products,
      },
    }

    return order
  }

  async function insertOrder(
    // priceInCents: number,
    // items: ProductApi[],
    // payment_intent: string,
    cartDetail: CartType,
    paymentIntentId: string,
    forceInsert = false,
  ): Promise<boolean> {
    loading.value = true
    error.value = false

    try {
      if (!deliveryDetails.value) {
        await loadLastOrder()
      }

      const carrierId = stepStore.livraisonDetails?.transporter?.id
      if (!carrierId) {
        console.warn("Aucun transporteur trouvé, impossible d'insérer la commande.")
        return false
      }

      const lastOrderFromDb = await getOrderService()
      const alreadyInserted = !!lastOrderFromDb && lastOrderFromDb.cart_id === cartDetail.id

      if (forceInsert || !alreadyInserted) {
        await inserOrderService(cartDetail, carrierId, paymentIntentId)
        // cartStore.clearCartStore()
      } else {
        console.log('Commande déjà insérée, rien à faire.')
      }

      await loadLastOrder()
      return true
    } catch (err) {
      console.error('Erreur dans insertOrder :', err)
      error.value = true
      return false
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentOrder(
    orderId: Order['id'],
    payment_intent: string,
  ): Promise<boolean> {
    console.log('updatePaymentOrder', orderId)
    loading.value = true
    error.value = false

    const paymentDetails = await fetchPaymentDetails(payment_intent)
    if (!paymentDetails) {
      console.warn('Aucun détail de paiement trouvé.')
      error.value = true
      loading.value = false
      return false
    }

    payment.value = paymentDetails
    formattedDate.value = new Date(paymentDetails.created * 1000).toLocaleString('fr-FR')

    try {
      const isOrderUpdated = await updatePaymentOrderService(orderId, payment_intent)
      if (!isOrderUpdated) {
        error.value = true
        return false
      }
      currentOrder.value = isOrderUpdated
      return true
    } catch (err) {
      console.error('Erreur dans updatePaymentOrder :', err)
      error.value = true
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete Products of order
  async function deleteOrder(orderId: Order['id']): Promise<boolean> {
    try {
      const isOrderDeleted = await deleteOrderFromBdd(orderId)

      if (!isOrderDeleted) {
        error.value = true
        return false
      }
      // currentOrder.value = isOrderDeleted
      return true
    } catch (err) {
      console.error('Erreur dans la suppression de la commande :', err)
      error.value = true
      return false
    } finally {
      loading.value = false
    }
  }

  // Update order table
  /*async function updateOrderTable(paymentIntentId: string): Promise<boolean> {
    try {
      const isOrderUpdated = await updateOrderFromBdd(paymentIntentId)

      if (!isOrderUpdated) {
        error.value = true
        return false
      }
      return true
    } catch (err) {
      console.error('Erreur dans la suppression de la commande :', err)
      error.value = true
      return false
    } finally {
      loading.value = false
    }
  }*/

  async function resetOrder(): Promise<boolean> {
    const test = await loadLastOrder()
    console.log('test reset', test)

    if (currentOrder.value?.id && currentOrder.value.id !== '0') {
      const deleted = await deleteOrder(currentOrder.value.id)
      if (!deleted) {
        throw new Error('Erreur lors de la suppression de la commande')
      }
      currentOrder.value = await loadLastOrder()
    }
    return true
  }

  return {
    effectiveOrder,
    currentOrder,
    payment_intent,
    deliveryDate,
    deliveryDetails,
    transporterInfo,
    payment,
    formattedDate,
    loading,
    error,
    insertOrder,
    updatePaymentOrder,
    loadLastOrder,
    createOrderFromCart,
    resetOrder,
    deleteOrder,
  }
}
