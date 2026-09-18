<script setup lang="ts">
import { Splitter } from 'reka-ui/namespaced'

withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    autoSaveId?: string
    firstDefaultSize?: number
    firstMinSize?: number
    secondMinSize?: number
  }>(),
  {
    direction: 'horizontal',
    autoSaveId: undefined,
    firstDefaultSize: 50,
    firstMinSize: 25,
    secondMinSize: 25,
  },
)
</script>

<template>
  <Splitter.Group
    :direction="direction"
    :auto-save-id="autoSaveId"
    class="vehicle-splitter"
  >
    <Splitter.Panel :default-size="firstDefaultSize" :min-size="firstMinSize">
      <slot name="first" />
    </Splitter.Panel>

    <Splitter.ResizeHandle class="vehicle-splitter-handle" />

    <Splitter.Panel :min-size="secondMinSize">
      <slot name="second" />
    </Splitter.Panel>
  </Splitter.Group>
</template>

<style scoped>
.vehicle-splitter {
  min-height: 22rem;
  overflow: hidden;
  border: 1px solid var(--color-border, #dbe4dc);
  border-radius: 0.9rem;
}

.vehicle-splitter :deep([data-panel]) {
  min-width: 0;
  overflow: auto;
}

.vehicle-splitter-handle {
  flex: 0 0 0.5rem;
  background: var(--color-border, #dbe4dc);
  cursor: col-resize;
  outline: none;
}

.vehicle-splitter-handle:hover,
.vehicle-splitter-handle:focus-visible {
  background: var(--color-primary, #246b45);
}

.vehicle-splitter[data-orientation='vertical'] .vehicle-splitter-handle {
  cursor: row-resize;
}
</style>
