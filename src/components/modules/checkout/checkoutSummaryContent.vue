<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { Component } from 'vue'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
interface SummaryContent {
  title: string
  component: Component
  cta: string
}
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
const estimatedDelivery = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  // Current date
  const today = new Date(Date.now())

  // Number of days to be delivered
  const processing: number = 2
  const deliveryDaysInfo: string | undefined =
    stepStore.getLivraisonDetails?.transporter.estimated_delivery_time
  const extractDeliveryDays = deliveryDaysInfo?.match(/\d+/g)?.map((n) => parseInt(n, 10)) || []
  const deliveryMaxDays = extractDeliveryDays.length > 0 ? Math.max(...extractDeliveryDays) : null
  const deliveryDay: number = deliveryMaxDays! + processing

  const newDate = new Date(today)
  let daysAdded = 0
  while (daysAdded < deliveryDay) {
    newDate.setDate(newDate.getDate() + 1)
    const dayOfWeek = newDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++
    }
  }
  return ' estimée le : ' + newDate.toLocaleDateString()
}
</script>

<template>
  <div
    class="grid justify-between grid-cols-auto grid-flow-col place-items-center my-5 border-b-2 border-primary"
  >
    <h3 class="text-[18px]">
      {{ title }}
      {{ id === 1 ? estimatedDelivery() : null }}
    </h3>
    <div v-if="id !== 1">
      <p>
        <RouterLink to="/cart" class="text-primary text-[14px]"
          >Modifier<span class="sr-only"> {{ data.cta }}</span></RouterLink
        >
      </p>
    </div>
  </div>
  <slot :content="currentContent" :GoToStep="props.GoToStep" />
</template>
