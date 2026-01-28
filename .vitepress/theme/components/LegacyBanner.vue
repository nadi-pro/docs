<script setup lang="ts">
defineProps<{
  newPath?: string
}>()
</script>

<template>
  <div class="px-6 py-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg mb-8">
    <h4 class="m-0 mb-2 text-orange-500 font-semibold text-base">
      Legacy Documentation
    </h4>
    <p class="m-0 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
      You are viewing documentation for Nadi v1.0. This version is no longer actively maintained.
      <template v-if="newPath">
        <a :href="newPath" class="text-[var(--vp-c-brand-1)] font-medium no-underline hover:underline">
          View the latest documentation
        </a>.
      </template>
      <template v-else>
        <a href="/" class="text-[var(--vp-c-brand-1)] font-medium no-underline hover:underline">
          View the latest documentation
        </a>.
      </template>
    </p>
  </div>
</template>
