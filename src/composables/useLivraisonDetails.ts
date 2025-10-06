// src/composables/useLivraisonDetails.ts
import { ref, watch, onMounted } from 'vue'
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { fetchShippingOptions, getTransporterDetails } from '@/services/ShippingOptions'
import type { ShippingMode } from '@/types/ShippingMode'

export function useLivraisonDetails() {
  const stepperStore = usecheckoutStepper()
  const shippingOptions = ref<ShippingMode | null>(null)
  const isLoading = ref(false)

  onMounted(async () => {
    await loadShippingOptions()
    await updateLivraisonDetails()
  })

  watch(
    () => [stepperStore.carrier, shippingOptions.value],
    async () => {
      await updateLivraisonDetails()
    },
    { immediate: true },
  )

  async function loadShippingOptions() {
    isLoading.value = true
    try {
      shippingOptions.value = await fetchShippingOptions()
    } catch (error) {
      console.error('Erreur lors du chargement des options de livraison', error)
    } finally {
      isLoading.value = false
    }
  }

  async function updateLivraisonDetails() {
    const carrierId = stepperStore.carrier
    const deliveryModes = shippingOptions.value?.delivery_modes

    if (carrierId && deliveryModes) {
      const details = await getTransporterDetails(deliveryModes, carrierId)
      stepperStore.setLivraisonDetails(details)
    } else {
      stepperStore.setLivraisonDetails(null)
    }
  }

  return {
    shippingOptions,
    isLoading,
  }
}
