<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    hn?: 1 | 2 | 3 | 4
  }>(),
  { hn: 2 },
)
</script>

<template>
  <component
    :is="`h${props.hn}`"
    data-slot="card-title"
    :class="
      props.hn === 1
        ? 'text-[clamp(1.25rem 0.1349rem+2.3202vw,1.875rem)]'
        : 'leading-none font-semibold'
    "
  >
    <slot />
  </component>
</template>
