<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'

const props = defineProps<{
  tabs: string[]
  labels?: string[]
}>()

const slots = useSlots()
const activeTab = ref(0)

const tabLabels = computed(() => {
  return props.labels || props.tabs
})
</script>

<template>
  <div class="sdk-tabs">
    <div class="tab-header">
      <button
        v-for="(tab, index) in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tabLabels[index] }}
      </button>
    </div>
    <div class="tab-panels">
      <div
        v-for="(tab, index) in tabs"
        :key="tab"
        class="tab-content"
        :class="{ active: activeTab === index }"
      >
        <slot :name="tab" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sdk-tabs {
  margin: 1.5rem 0;
}

.tab-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--vp-c-text-1);
}

.tab-btn.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>
