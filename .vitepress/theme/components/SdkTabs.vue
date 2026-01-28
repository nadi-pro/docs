<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  tabs: string[]
  labels?: string[]
}>()

const activeTab = ref(0)

const tabLabels = computed(() => {
  return props.labels || props.tabs
})
</script>

<template>
  <div class="my-6">
    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
      <button
        v-for="(tab, index) in tabs"
        :key="tab"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer bg-transparent border-transparent"
        :class="
          activeTab === index
            ? 'text-[var(--vp-c-brand-1)] !border-[var(--vp-c-brand-1)]'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        "
        @click="activeTab = index"
      >
        {{ tabLabels[index] }}
      </button>
    </div>
    <div>
      <div
        v-for="(tab, index) in tabs"
        :key="tab"
        :class="activeTab === index ? 'block' : 'hidden'"
      >
        <slot :name="tab" />
      </div>
    </div>
  </div>
</template>
