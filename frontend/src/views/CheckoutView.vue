<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { stepType } from '@/types/Stepper'
// Ui
import { Button } from '@/components/ui/button'
import Stepper from '@/components/modules/checkout/CheckoutStepper.vue'
import Step from '@/components/modules/checkout/CheckoutStep.vue'
import CheckoutSummary from '@/components/modules/checkout/CheckoutSummary.vue'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useOrderStore } from '@/store/OrderStore'
import { useCartStore } from '@/store/CartStore'

/**
 * Data : Step navigation
 */
const orderStore = useOrderStore()
const cartStore = useCartStore()
const productInCart = computed(() => cartStore.cart)

const stepStore = usecheckoutStepper()
const steps: stepType[] = stepStore.steps

const GoToStep = (stepNumber: number): void => {
  stepStore.changeStep(stepNumber)
}
const nextStep = (stepNumber: number): void => {
  stepStore.incrementStep(stepNumber)
}
const prevtStep = (): void => {
  stepStore.decrementStep()
}
</script>
<template>
  <div
    id="checkout"
    class="grid gap-[clamp(1.25rem,0.3571rem+4.4643vw,2.5rem)] md:grid-cols-[minmax(350px,1fr)_minmax(300px,1fr)] md:max-[1126px]:grid-cols-[minmax(350px,1fr)] grid-cols-1"
    v-if="productInCart"
  >
    <div>
      <div class="grid">
        <h1 class="mt-10 mb-5 text-[30px]">Commande</h1>
        <Stepper :productInCart :GoToStep="GoToStep" />
      </div>

      <template v-for="stepDetail in steps">
        <Step
          v-if="stepStore.step === stepDetail.step"
          :title="stepDetail.description"
          :step="stepDetail.step"
        >
          <template #default="{ content }">
            <component :is="content" />
          </template>
        </Step>
      </template>

      <div
        :class="[
          'flex flex-row flex-wrap h-auto md:mb-0 mb-5',
          stepStore.step != 0 ? 'justify-between ' : 'justify-end',
        ]"
        v-if="productInCart.products.length"
      >
        <Button
          v-if="stepStore.step > 0 && stepStore.step < steps.length - 2"
          type="button"
          class="btn"
          @click="prevtStep()"
          >Revenir à l'étape précédente</Button
        >
        <Button
          v-if="stepStore.step < steps.length - 2"
          type="button"
          class="btn"
          @click="nextStep(stepStore.step)"
          :disabled="!orderStore.deliveryDetails?.transporter.id && stepStore.step === 1"
          >Passer à l'étape suivante</Button
        >
      </div>
    </div>
    <div>
      <CheckoutSummary :GoToStep="GoToStep" />
    </div>
  </div>
</template>
<style lang="css">
@import '@/assets/styles/checkout.css';
</style>
