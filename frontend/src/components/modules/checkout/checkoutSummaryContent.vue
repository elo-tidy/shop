<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { Component } from 'vue'
interface SummaryContent {
  title: string
  component: Component
  cta: string
}
// Store
import { useOrderStore } from '@/store/OrderStore'

// Props
const props = defineProps<{
  GoToStep?: (stepNumber: number) => void
  data: SummaryContent
  index: number
}>()

// Data
const title = computed(() => props.data.title)
const id = computed(() => props.index)
const currentContent = computed(() => props.data.component)
const orderStore = useOrderStore()
const deliveryDate = computed(() => orderStore.deliveryDetails?.deliveryDate)
const isPaid = computed(() => orderStore.isPaid)

// Enable step edition if order is not completed
const isEditable = computed(() => !isPaid.value)
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
