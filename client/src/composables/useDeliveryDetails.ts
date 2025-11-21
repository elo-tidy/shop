import { computed } from 'vue'
import { useOrderProcess } from '@/composables/useOrderProcess'

export function useDeliveryDetails() {
  const { effectiveOrder, deliveryDetails } = useOrderProcess()

  const carrierMode = computed(() => deliveryDetails.value?.deliveryMode ?? 'default')
  const carrierName = computed(() => effectiveOrder.value.delivery_carrier ?? '')
  const carrierPrice = computed(() => effectiveOrder.value.delivery_price ?? 0)
  const estimatedDeliveryDate = computed(
    () =>
      effectiveOrder.value.delivery_date ??
      deliveryDetails.value?.transporter?.estimated_delivery_time,
  )

  return {
    carrierMode,
    carrierName,
    carrierPrice,
    estimatedDeliveryDate,
  }
}
