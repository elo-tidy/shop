// src/store/OrderStepperStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { stepType } from '@/types/Stepper'
import type { Transporter } from '@/types/ShippingMode'

export const usecheckoutStepper = defineStore(
  'checkoutStepper',
  () => {
    // state
    const step = ref(0)
    const higherStepValidated = ref(0)
    const carrier = ref('')
    const livraisonDetails = ref<{
      transporter: Transporter
      deliveryMode: string
      deliveryModeId: string
    } | null>(null)

    const steps = ref<stepType[]>([
      {
        id: 'informations_client',
        step: 0,
        title: 'Étape 1',
        description: 'Informations client',
        stepValidated: false,
      },
      {
        id: 'livraison',
        step: 1,
        title: 'Étape 2',
        description: 'Livraison',
        stepValidated: false,
      },
      {
        id: 'paiement',
        step: 2,
        title: 'Étape 3',
        description: 'Paiement',
        stepValidated: false,
      },
      {
        id: 'confirmation',
        step: 3,
        title: 'Étape 4',
        description: 'Confirmation',
        stepValidated: false,
      },
    ])

    // Getters
    const getSteps = computed(() => steps.value)
    const getStepsNumber = computed(() => steps.value.length)
    const getLivraisonDetails = computed(() => livraisonDetails.value)

    // Actions
    function validStep(stepNumber: number) {
      steps.value[stepNumber].stepValidated = true
    }

    function changeStep(stepNumber: number) {
      step.value = stepNumber
    }

    function incrementStep(stepNumber: number) {
      validStep(stepNumber)
      step.value++
    }

    function decrementStep() {
      step.value--
    }

    function setTransporter(carrierName: string) {
      carrier.value = carrierName
    }

    function setLivraisonDetails(payload: typeof livraisonDetails.value) {
      livraisonDetails.value = payload
    }

    return {
      step,
      higherStepValidated,
      carrier,
      steps,

      getSteps,
      getStepsNumber,
      getLivraisonDetails,

      validStep,
      changeStep,
      incrementStep,
      decrementStep,
      setTransporter,
      setLivraisonDetails,
    }
  },
  {
    persist: true,
  },
)
