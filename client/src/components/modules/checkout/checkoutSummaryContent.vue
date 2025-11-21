<script lang="ts" setup>
import { computed, onMounted } from 'vue'
// Types
import type { Component } from 'vue'
interface SummaryContent {
  title: string
  component: Component
  cta: string
}
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  GoToStep?: (stepNumber: number) => void
  data: SummaryContent
  index: number
}>()

/**
 * Data : props - estimated delivery date - step edition
 */

// Props
const title = computed(() => props.data.title)
const id = computed(() => props.index)
const currentContent = computed(() => props.data.component)

// Delivery estimated date
const { deliveryDate } = useOrderProcess()

// Enable step edition if order is not completed
const stepStore = usecheckoutStepper()
const isEditable = computed((): boolean => {
  return stepStore.getSteps.findLastIndex((step) => step.stepValidated === true) !== 3
})
</script>

<template>
  <div
    class="grid justify-between grid-cols-auto grid-flow-col place-items-center my-5 border-b-2 border-primary"
  >
    <h3 class="text-[18px]">
      {{ title }}
      {{ id === 1 ? ' estimée le : ' + deliveryDate : null }}
    </h3>
    <div v-if="id !== 1 && isEditable">
      <p>
        <RouterLink to="/cart" class="text-primary text-[14px]"
          >Modifier<span class="sr-only"> {{ data.cta }}</span></RouterLink
        >
      </p>
    </div>
  </div>
  <slot :content="currentContent" :GoToStep="props.GoToStep" />
</template>
