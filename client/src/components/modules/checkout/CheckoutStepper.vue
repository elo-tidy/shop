<script lang="ts" setup>
// Types
import type { CartType } from '@/types/Cart'
import type { stepType } from '@/types/Stepper'

// Ui
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Check, Circle, Dot } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'

// Props
const props = defineProps<{
  productInCart: CartType
  GoToStep: (stepNumber: number) => void
}>()

// Step store data
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

  // 🔒 Si la dernière étape est atteinte ET validée => aucune étape ne doit être cliquable
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
</script>
<template>
  <Stepper
    class="flex w-full items-start gap-2 -order-1"
    v-if="productInCart.products.length"
    :defaultValue="stepStore.step"
    :totalSteps="stepStore.getStepsNumber"
    :linear="false"
  >
    <StepperItem
      v-for="(stepItem, index) in steps"
      :key="stepItem.step"
      class="relative flex w-full flex-col items-center justify-center"
      :step="stepItem.step"
      :completed="stepItem.stepValidated"
      :disabled="!isStepClickable(stepItem, index)"
      :aria-current="stepStore.step === stepItem.step ? 'step' : undefined"
      :aria-label="`Étape ${stepItem.step + 1} sur ${steps.length} : ${stepItem.description}`"
      :data-index="index"
      :data-store="stepStore.steps.length - 1"
    >
      <StepperSeparator
        v-if="stepItem.step !== steps[steps.length - 1].step"
        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
      />

      <StepperTrigger as-child>
        <Button
          :variant="getStepState(index) !== 'inactive' ? 'default' : 'outline'"
          size="icon"
          class="z-10 rounded-full shrink-0"
          :class="[
            'z-10 rounded-full shrink-0',
            stepStore.step === stepItem.step
              ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
              : undefined,
          ]"
          @click="GoToStep(stepItem.step)"
        >
          <Check v-if="getStepState(index) === 'completed'" class="size-5" />
          <Circle v-else-if="getStepState(index) === 'active'" />
          <Dot v-else />
        </Button>
      </StepperTrigger>

      <div class="mt-5 flex flex-col items-center text-center">
        <StepperTitle
          :class="[getStepState(index) === 'active' && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base"
        >
          {{ stepItem.title }}
        </StepperTitle>
        <StepperDescription
          :class="[getStepState(index) === 'active' && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
        >
          {{ stepItem.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </Stepper>
</template>
