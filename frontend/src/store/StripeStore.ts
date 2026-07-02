import { defineStore } from "pinia";
import { ref } from "vue";

export const usePaymentStore = defineStore(
  "payment",
  () => {
    // State
    const paymentIntentId = ref<string | null>(null);
    const stripeLoaded = ref<boolean>(true);

    // Actions
    function resetPayment(): void {
      paymentIntentId.value = null;
      setStripeLoaded(true);
    }
    function initWithExistingPi(pi: string): void {
      paymentIntentId.value = pi;
      setStripeLoaded(false);
    }
    function setStripeLoaded(arg: boolean): void {
      stripeLoaded.value = arg;
    }

    return {
      paymentIntentId,
      stripeLoaded,
      initWithExistingPi,
      resetPayment,
      setStripeLoaded,
    };
  },
  {
    persist: true,
  },
);
