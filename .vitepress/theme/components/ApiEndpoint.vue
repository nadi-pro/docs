<script setup lang="ts">
defineProps<{
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
}>()
</script>

<template>
  <div class="api-endpoint">
    <span class="method" :class="method.toLowerCase()">{{ method }}</span>
    <code class="path">{{ path }}</code>
  </div>
</template>

<style scoped>
.api-endpoint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
}

.method {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
}

.method.get {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.method.post {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.method.put,
.method.patch {
  background-color: rgba(249, 115, 22, 0.15);
  color: #f97316;
}

.method.delete {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.path {
  color: var(--vp-c-text-1);
  background: none;
  font-size: inherit;
}
</style>
