<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
// Store
import { usecheckoutStepper } from '@/store/OrderStepperStore'

/**
 * Data : order detail - delivery
 */
const route = useRoute()

// Data Order details
const {
  payment_intent,
  payment,
  formattedDate,
  effectiveOrder,
  deliveryDetails,
  deliveryDate,
  loading,
  error,
  currentOrder,
  updateOrder,
  loadLastOrder,
} = useOrderProcess()

// Data delivery
const deliveryMode = computed(() => deliveryDetails.value?.deliveryMode)
const shippingDate = computed(() => deliveryDate.value)

// Update order payment status to paid after payment_intent - load order details
onMounted(async () => {
  if (payment_intent) {
    await updateOrder(effectiveOrder.value.id, payment_intent)
    await loadLastOrder()
  }
})

// Reset StepStore before route leaving - reset local order
const stepper = usecheckoutStepper()
onBeforeRouteLeave(() => {
  if (route.query.redirect_status === 'succeeded') {
    stepper.resetStepper()
    currentOrder.value = null
  }
})
</script>

<template>
  <div v-if="loading">Chargement...</div>

  <div v-else-if="error" class="error">
    <p>Une erreur est survenue lors de la récupération de la commande.</p>
  </div>

  <div v-else class="success">
    <p>Merci pour votre commande !</p>

    <h3 class="text-[18px] mt-5">Détails de la commande :</h3>
    <div class="mt-2" v-if="payment">
      <p><strong>Commande numéro :</strong> {{ effectiveOrder?.id }}</p>
      <p><strong>Date :</strong> {{ formattedDate }}</p>
      <p><strong>Montant :</strong> {{ effectiveOrder?.total_price }} €</p>
      <p><strong>Moyen de paiement :</strong> {{ effectiveOrder?.payment_method }}</p>
      <p><strong>Paiement n°:</strong> {{ payment?.id }}</p>
    </div>

    <h3 class="text-[18px] mt-5">Modalités de livraison :</h3>
    <div class="mt-2" v-if="payment">
      <p><strong>Mode de livraison :</strong> {{ deliveryMode }}</p>
      <p><strong>Transporteur :</strong> {{ effectiveOrder.delivery_carrier }}</p>
      <p>
        <strong>Frais de transport :</strong>
        {{ effectiveOrder.delivery_price }} €
      </p>
      <p><strong>Livraison estimée le :</strong> {{ shippingDate }}</p>
    </div>
  </div>
</template>
