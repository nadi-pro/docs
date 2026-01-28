<script setup lang="ts">
defineProps<{
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
}>()

const methodClasses: Record<string, string> = {
  get: 'bg-green-500/15 text-green-500',
  post: 'bg-blue-500/15 text-blue-500',
  put: 'bg-orange-500/15 text-orange-500',
  patch: 'bg-orange-500/15 text-orange-500',
  delete: 'bg-red-500/15 text-red-500',
}
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg my-4 font-mono text-sm">
    <span
      class="px-2 py-1 text-xs font-semibold rounded uppercase"
      :class="methodClasses[method.toLowerCase()]"
    >
      {{ method }}
    </span>
    <code class="text-gray-900 dark:text-gray-100 bg-transparent text-inherit">{{ path }}</code>
  </div>
</template>
