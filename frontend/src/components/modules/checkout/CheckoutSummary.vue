<script lang="ts" setup>
// Types
import type { Component } from 'vue'
import type { stepType } from '@/types/Stepper'
interface SummaryContent {
  title: string
  component: Component
  cta: string
}
// Components
import checkoutSummaryContent from '@/components/modules/checkout/checkoutSummaryContent.vue'
import CheckoutSummaryContent0 from '@/components/modules/checkout/CheckoutSummaryContent0.vue'
import CheckoutSummaryContent1 from '@/components/modules/checkout/CheckoutSummaryContent1.vue'
// Store
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  GoToStep: (stepNumber: number) => void
}>()

/**
 * Data : stepstore - component content -
 */

const stepStore = usecheckoutStepper()

// Content
const contents: Record<number, SummaryContent> = {
  0: {
    title: 'Mon panier',
    cta: 'mon panier',
    component: CheckoutSummaryContent0,
  },
  1: { title: 'Livraison', cta: 'la livraison', component: CheckoutSummaryContent1 },
}

// Step visibility
const isStepVisible = (i: number, steps: stepType[]): boolean => {
  if (Number(i) === 0) return true
  if (steps[Number(i)].stepValidated === true) return true
  return false
}
</script>
<template>
  <div class="sticky -top-10 border bg-background h-[calc(100dvh-48px)]">
    <h2 class="text-[23px] px-10 pt-5">Récapitulatif de ma commande</h2>
    <div class="px-10 mb-5 max-h-[calc(100dvh-48px-74.5px-calc(var(--spacing)*5)))] overflow-auto">
      <template v-for="(sumContent, index) in contents" :key="index">
        <template v-if="isStepVisible(index, stepStore.getSteps)">
          <checkoutSummaryContent
            :GoToStep="props.GoToStep"
            :data="sumContent"
            :index="Number(index)"
          >
            <template #default="{ content }">
              <component :is="content" :GoToStep="props.GoToStep" />
            </template>
          </checkoutSummaryContent>
        </template>
      </template>
    </div>
  </div>
</template>
