<script lang="ts" setup>
import { computed } from 'vue'
// Types
import type { Component } from 'vue'
// Ui
import { Card } from '@/components/ui/card'
// Components
import CheckoutStepContent0 from '@/components/modules/checkout/CheckoutStepContent0.vue'
import CheckoutStepContent1 from '@/components/modules/checkout/CheckoutStepContent1.vue'
import CheckoutStepContent2 from '@/components/modules/checkout/CheckoutStepContent2.vue'
import CheckoutStepContent3 from '@/components/modules/checkout/CheckoutStepContent3.vue'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  step: number
  title: string
}>()

/**
 * Data : step components init
 */

// Step init
const stepStore = usecheckoutStepper()
const stepProp = computed(() => ({
  title: props.title,
  contentId: props.step,
}))

// Components
const content: Record<number, Component> = {
  0: CheckoutStepContent0,
  1: CheckoutStepContent1,
  2: CheckoutStepContent2,
  3: CheckoutStepContent3,
}

// Current step content
const currentContent = computed(() => content[stepStore.step])
</script>

<template>
  <div>
    <h2 class="mb-5 text-[23px]">{{ stepProp.title }}</h2>
    <div class="grid gap-y-10 max-w-xxl">
      <Card class="px-6">
        <slot :content="currentContent" />
      </Card>
    </div>
  </div>
</template>
