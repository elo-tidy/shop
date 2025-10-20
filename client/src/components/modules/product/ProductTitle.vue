<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  hn?: 1 | 4
}>()

const hn = props.hn ?? 2
</script>

<template>
  <component
    :is="`h${hn}`"
    data-slot="card-title"
    :class="hn === 1 ? 'text-[30px]' : 'leading-none font-semibold'"
  >
    <slot />
  </component>
</template>
