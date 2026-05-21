import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore(
  'payment',
  () => {
    const paymentIntentId = ref<string | null>(null)

    function resetPayment() {
      paymentIntentId.value = null
    }
    function initWithExistingPi(pi:string) {
      paymentIntentId.value = pi
    }

    return {
      paymentIntentId,
      initWithExistingPi,
      resetPayment,
    }
  },
  {
    persist: true,
  },
)
