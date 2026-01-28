<script setup lang="ts">
defineProps<{
  type?: 'required' | 'optional' | 'new' | 'deprecated' | 'coming-soon'
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
  padding: 0.0625rem 0.375rem;
  font-size: 0.65rem;
  font-weight: 500;
  border-radius: 4px;
  margin-left: 0.375rem;
  vertical-align: middle;
  line-height: 1.4;
}

.version-badge.required {
  background-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.version-badge.optional {
  background-color: rgba(139, 92, 246, 0.2);
  color: #7c3aed;
}

.version-badge.new {
  background-color: rgba(34, 197, 94, 0.2);
  color: #16a34a;
}

.version-badge.deprecated {
  background-color: rgba(249, 115, 22, 0.2);
  color: #ea580c;
}

.version-badge.coming-soon {
  background-color: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}
</style>
