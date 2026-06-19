// src/store/OrderStepperStore.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { stepType } from "@/types/Stepper";
import type {
  DeliveryDetails,
  DeliveryDetailsWrapper,
  DeliveryMode,
  Transporter,
} from "@shared/types/ShippingMode";
import { getCarrierDetails } from "@/services/CarrierService";

export const usecheckoutStepper = defineStore(
  "checkoutStepper",
  () => {
    // state
    const step = ref(0);
    // const livraisonDetails = ref<{deliveryMode: DeliveryMode['name'], transporter:Transporter} | null>(null)
    const steps = ref<stepType[]>([
      {
        id: "informations_client",
        step: 0,
        title: "Étape 1",
        description: "Informations client",
        stepValidated: false,
      },
      {
        id: "livraison",
        step: 1,
        title: "Étape 2",
        description: "Livraison",
        stepValidated: false,
      },
      {
        id: "paiement",
        step: 2,
        title: "Étape 3",
        description: "Paiement",
        stepValidated: false,
      },
      {
        id: "confirmation",
        step: 3,
        title: "Étape 4",
        description: "Paiement confirmé",
        stepValidated: false,
      },
    ]);

    // Getters
    const getSteps = computed(() => steps.value);
    // const getLivraisonDetails = computed(() => livraisonDetails.value)

    // Actions
    function validStep(stepNumber: number): void {
      steps.value[stepNumber].stepValidated = true;
    }
    function changeStep(stepNumber: number): void {
      step.value = stepNumber;
    }
    function incrementStep(stepNumber: number): void {
      validStep(stepNumber);
      step.value++;
    }
    function decrementStep(): void {
      step.value--;
    }
    // async function setLivraisonDetails(transporterId: Transporter["id"]) {
    //   livraisonDetails.value = await getCarrierDetails(transporterId)
    // }
    // function clearLivraisonDetails() {
    //   livraisonDetails.value = null
    // }
    function resetStepper(): void {
      step.value = 0;
      // clearLivraisonDetails()
      steps.value.forEach((step) => (step.stepValidated = false));
    }

    return {
      step,
      steps,
      // livraisonDetails,
      getSteps,
      // getLivraisonDetails,
      validStep,
      changeStep,
      incrementStep,
      decrementStep,
      // setLivraisonDetails,
      // clearLivraisonDetails,
      resetStepper,
    };
  },
  {
    persist: true,
  },
);
