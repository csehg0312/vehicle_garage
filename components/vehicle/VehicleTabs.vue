<script setup lang="ts">
import { Tabs } from 'reka-ui/namespaced'

export interface VehicleTab {
  value: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    tabs: VehicleTab[]
    defaultValue?: string
    ariaLabel?: string
  }>(),
  {
    defaultValue: '',
    ariaLabel: 'Vehicle sections',
  },
)

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <Tabs.Root v-model="modelValue" class="vehicle-tabs" :default-value="props.defaultValue">
    <Tabs.List class="vehicle-tabs-list" :aria-label="props.ariaLabel">
      <Tabs.Trigger
        v-for="tab in props.tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        class="vehicle-tab-trigger"
      >
        {{ tab.label }}
      </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content
      v-for="tab in props.tabs"
      :key="`${tab.value}-content`"
      :value="tab.value"
      class="vehicle-tab-content"
    >
      <slot :name="`tab-${tab.value}`" :tab="tab" />
    </Tabs.Content>
  </Tabs.Root>
</template>

<style scoped>
.vehicle-tabs-list {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-border, #dbe4dc);
  scrollbar-width: thin;
}

.vehicle-tab-trigger {
  min-height: 2.75rem;
  flex: 0 0 auto;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--color-muted, #647064);
  cursor: pointer;
  padding: 0.65rem 0.85rem;
  white-space: nowrap;
}

.vehicle-tab-trigger:hover,
.vehicle-tab-trigger[data-state='active'] {
  color: var(--color-primary, #246b45);
}

.vehicle-tab-trigger[data-state='active'] {
  border-bottom-color: currentColor;
}

.vehicle-tab-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.vehicle-tab-content {
  padding-top: 1rem;
  outline: none;
}
</style>
