<script setup lang="ts">
defineProps<{
  title: string
  eyebrow?: string
  description?: string
}>()
</script>

<template>
  <section class="vehicle-section">
    <header class="vehicle-section-header">
      <div>
        <p v-if="eyebrow" class="vehicle-section-eyebrow">{{ eyebrow }}</p>
        <h2 class="vehicle-section-title">{{ title }}</h2>
        <p v-if="description" class="vehicle-section-description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="vehicle-section-actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="vehicle-section-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.vehicle-section {
  border: 1px solid var(--color-border, #dbe4dc);
  border-radius: 0.9rem;
  background: var(--color-surface, #fff);
  padding: 1rem;
}

.vehicle-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.vehicle-section-eyebrow {
  margin: 0 0 0.2rem;
  color: var(--color-muted, #647064);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.vehicle-section-title {
  margin: 0;
  font-size: 1.1rem;
}

.vehicle-section-description {
  max-width: 65ch;
  margin: 0.35rem 0 0;
  color: var(--color-muted, #647064);
  font-size: 0.9rem;
}

.vehicle-section-actions {
  flex: 0 0 auto;
}

.vehicle-section-content {
  min-width: 0;
}

@media (max-width: 640px) {
  .vehicle-section-header {
    flex-direction: column;
  }
}
</style>
