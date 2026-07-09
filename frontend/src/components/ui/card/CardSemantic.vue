<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    as?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'article',
  },
)
</script>

<template>
  <component
    data-slot="card"
    :is="as"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </component>
</template>
