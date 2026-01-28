<script setup lang="ts">
defineProps<{
  newPath?: string
}>()
</script>

<template>
  <div class="legacy-banner">
    <h4>Legacy Documentation</h4>
    <p>
      You are viewing documentation for Nadi v1.0. This version is no longer actively maintained.
      <template v-if="newPath">
        <a :href="newPath">View the latest documentation</a>.
      </template>
      <template v-else>
        <a href="/">View the latest documentation</a>.
      </template>
    </p>
  </div>
</template>

<style scoped>
.legacy-banner {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.legacy-banner h4 {
  margin: 0 0 0.5rem 0;
  color: #f97316;
  font-weight: 600;
  font-size: 1rem;
}

.legacy-banner p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
}

.legacy-banner a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
}

.legacy-banner a:hover {
  text-decoration: underline;
}
</style>
