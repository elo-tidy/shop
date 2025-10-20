<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { Component } from 'vue'
interface SummaryContent {
  title: string
  component: Component
  cta: string
}
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  GoToStep?: (stepNumber: number) => void
  data: SummaryContent
  index: number
}>()

const title = computed(() => props.data.title)
const id = computed(() => props.index)
const currentContent = computed(() => props.data.component)

// Delivery estimated date
const stepStore = usecheckoutStepper()
const estimatedDelivery = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  // Current date
  const today: Date = new Date(Date.now())

  // Number of days to be delivered
  const processing: number = 2
  const deliveryDaysInfo: string | undefined =
    stepStore.getLivraisonDetails?.transporter.estimated_delivery_time
  const extractDeliveryDays: number[] =
    deliveryDaysInfo?.match(/\d+/g)?.map((n) => parseInt(n, 10)) || []
  const deliveryMaxDays: number | null =
    extractDeliveryDays.length > 0 ? Math.max(...extractDeliveryDays) : null
  const deliveryDay: number = deliveryMaxDays! + processing

  const newDate: Date = new Date(today)
  let daysAdded: number = 0
  while (daysAdded < deliveryDay) {
    newDate.setDate(newDate.getDate() + 1)
    const dayOfWeek = newDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++
    }
  }
  return ' estimée le : ' + newDate.toLocaleDateString()
}
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
      {{ id === 1 ? estimatedDelivery() : null }}
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
