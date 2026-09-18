<template>
  <div class="field">
    <label :for="selectId">{{ label }}</label>
    <Select.Root v-model="modelValue" :disabled="disabled">
      <Select.Trigger :id="selectId" class="select-trigger" :aria-label="label" :aria-invalid="Boolean(error)" :disabled="disabled">
        <Select.Value :placeholder="placeholder" />
      </Select.Trigger>
      <Select.Portal><Select.Content class="select-content" position="popper" side="bottom" align="start" :side-offset="4">
        <Select.Viewport class="select-viewport">
          <Select.Item v-for="option in options" :key="option" :value="option" class="select-item">
            <Select.ItemText>{{ option }}</Select.ItemText>
          </Select.Item>
        </Select.Viewport>
      </Select.Content></Select.Portal>
    </Select.Root>
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import { useId } from 'vue'
import { Select } from 'reka-ui/namespaced'
const { label, options, placeholder, error, disabled } = defineProps<{ label: string; options: string[]; placeholder?: string; error?: string; disabled?: boolean }>()
const modelValue = defineModel<string>({ required: true })
const selectId = useId()
</script>
<style scoped>
.field { display: grid; gap: 6px; }.field label { font-size: 12px; font-weight: 700; }.select-trigger { display: flex; width: 100%; min-height: 42px; align-items: center; justify-content: space-between; border: 1px solid #d4ded4; border-radius: 6px; padding: 10px 12px; background: #fbfcf9; color: #1d2925; text-align: left; }.select-trigger:disabled { cursor: not-allowed; opacity: .6; }.error { color: #a23f35; font-size: 12px; }
:global(.select-content) { z-index: 10; min-width: var(--reka-select-trigger-width); overflow: hidden; border: 1px solid #d4ded4; border-radius: 6px; background: #fbfcf9; box-shadow: 0 8px 20px rgb(29 41 37 / 14%); }
:global(.select-viewport) { padding: 4px; }.select-item { cursor: pointer; padding: 8px 10px; }.select-item[data-highlighted] { background: #e5eee3; outline: none; }
</style>
