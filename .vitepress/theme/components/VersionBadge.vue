<script setup lang="ts">
defineProps<{
  type?: 'required' | 'optional' | 'new' | 'deprecated'
  version?: string
}>()
</script>

<template>
  <span class="version-badge" :class="type || 'required'">
    <slot>{{ version }}</slot>
  </span>
</template>

<style scoped>
.version-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.version-badge.required {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.version-badge.optional {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.version-badge.new {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.version-badge.deprecated {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}
</style>
