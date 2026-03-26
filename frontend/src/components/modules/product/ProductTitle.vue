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
    :class="props.hn === 1 ? 'text-[30px]' : 'leading-none font-semibold'"
  >
    <slot />
  </component>
</template>
