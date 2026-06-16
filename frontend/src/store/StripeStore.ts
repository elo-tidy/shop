import { set } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore(
  'payment',
  () => {

    // State
    const paymentIntentId = ref<string | null>(null)
    const stripeLoaded = ref<boolean>(true)

    // Actions
    function resetPayment() {
      paymentIntentId.value = null
      setStripeLoaded(true)
    }
    function initWithExistingPi(pi:string) {
      paymentIntentId.value = pi
      setStripeLoaded(false)
    }
    function setStripeLoaded(arg:boolean) {
      stripeLoaded.value = arg
    }
    
    return {
      paymentIntentId,
      stripeLoaded,
      initWithExistingPi,
      resetPayment,
      setStripeLoaded,
    }
  },
  {
    persist: true,
  },
)
