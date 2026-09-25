<script lang="ts" setup>
// Types
import type { CartType } from '@shop/shared/types/Cart'
import type { stepType } from '@/types/Stepper'
// Ui
import { Stepper, StepperItem, StepperSeparator, StepperTrigger } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Composables
import { useBreakpoint } from '@/composables/useBreakpoints'
import { computed } from 'vue'

// Props
const props = defineProps<{
  productInCart: CartType
  GoToStep: (stepNumber: number) => void
}>()

// Steps details
const stepStore = usecheckoutStepper()
const steps = stepStore.steps

// Stepper utilities
const getStepState = (index: number): 'completed' | 'active' | 'inactive' => {
  if (steps[index].stepValidated) return 'completed'
  if (index === 0 || steps[index - 1]?.stepValidated) return 'active'
  return 'inactive'
}
const isStepClickable = (stepItem: stepType, index: number): boolean => {
  const currentStep = stepStore.step
  const lastStepIndex = steps.length - 1
  const lastStep = steps[lastStepIndex]
  const isLastStepValidatedAndActive = currentStep === lastStep.step && lastStep.stepValidated

  if (isLastStepValidatedAndActive) {
    return false
  }

  const previousStepValidated = index > 0 && steps[index - 1].stepValidated
  const currentStepNotValidated = !stepItem.stepValidated && !steps[index].stepValidated
  const isLastStep = index === lastStepIndex

  if (isLastStep && stepItem.step === currentStep && stepItem.stepValidated) return false

  if (stepItem.stepValidated) return true
  if (stepItem.step === currentStep) return true

  if (previousStepValidated && currentStepNotValidated) {
    return true
  }

  return false
}

const { isSm } = useBreakpoint()
const stepper = computed(() => {
  const direction = !isSm.value ? 'horizontal' : 'vertical'
  const classes = !isSm.value ? 'justify-center items-start' : 'justify-start flex-col gap-10'
  const itemClasses = !isSm.value ? 'flex-col items-center' : 'items-start gap-6'
  const separatorClasses = !isSm.value
    ? 'left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 h-0.5 '
    : 'left-[18px] top-[38px] h-[105%] w-0.5 '
  const titleClasses = !isSm.value ? 'top-full mt-4 ' : 'translate-x-full text-left -right-4'
  return { direction, classes, itemClasses, separatorClasses, titleClasses }
})
</script>
<template>
  <Stepper
    id="stepper"
    :class="['flex w-full  gap-2 -order-1 mb-10', `${stepper.classes}`]"
    v-if="productInCart.products.length"
    v-model="stepStore.step"
    :linear="false"
    aria-label="Étapes de la commande"
  >
    <StepperItem
      v-for="(stepItem, index) in steps"
      :key="stepItem.step"
      :class="['relative flex w-full', `${stepper.itemClasses}`]"
      :step="stepItem.step"
      :completed="stepItem.stepValidated"
      :disabled="!isStepClickable(stepItem, index)"
      :aria-current="stepStore.step === stepItem.step ? 'step' : null"
      :aria-label="`Étape ${stepItem.step + 1} sur ${steps.length} : ${stepItem.description}`"
      :data-index="index"
      :data-store="stepStore.steps.length - 1"
    >
      <StepperSeparator
        v-if="stepItem.step !== steps[steps.length - 1].step"
        :class="[
          'absolute  block shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary',
          `${stepper.separatorClasses}`,
        ]"
      />

      <StepperTrigger as-child>
        <Button
          :variant="getStepState(index) !== 'inactive' ? 'default' : 'outline'"
          size="icon"
          :class="[
            'z-10 rounded-full shrink-0 relative',
            getStepState(index),
            stepStore.step === stepItem.step
              ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
              : null,
          ]"
          @click="GoToStep(stepItem.step)"
          :title="`Revenir à l'${stepItem.title} - ${stepItem.description}`"
          ><span :class="['step-title absolute  text-white', `${stepper.titleClasses}`]"
            >{{ stepItem.title }} <span class="step-desc">{{ stepItem.description }}</span></span
          >
        </Button>
      </StepperTrigger>
    </StepperItem>
  </Stepper>
</template>
