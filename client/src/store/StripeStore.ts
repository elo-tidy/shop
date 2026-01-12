import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore(
  'payment',
  () => {
    const paymentIntentId = ref<string | null>(null)

    function resetPayment() {
      paymentIntentId.value = null
    }

    return {
      paymentIntentId,
      resetPayment,
    }
  },
  {
    persist: true,
  },
)
