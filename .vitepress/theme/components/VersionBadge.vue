<script setup lang="ts">
defineProps<{
  type?: 'required' | 'optional' | 'new' | 'deprecated' | 'coming-soon'
  version?: string
}>()

const typeClasses: Record<string, string> = {
  required: 'bg-red-500/20 text-red-600 dark:text-red-400',
  optional: 'bg-violet-500/20 text-violet-600 dark:text-violet-400',
  new: 'bg-green-500/20 text-green-600 dark:text-green-400',
  deprecated: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  'coming-soon': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
}
</script>

<template>
  <span
    class="inline-flex items-center px-1.5 py-0.5 text-[0.65rem] font-medium rounded ml-1.5 align-middle leading-normal"
    :class="typeClasses[type || 'required']"
  >
    <slot>{{ version }}</slot>
  </span>
</template>
