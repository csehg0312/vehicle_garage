<template>
  <div class="field">
    <label :for="inputId">{{ label }}</label>
    <Combobox.Root :model-value="modelValue" :disabled="disabled" @update:model-value="updateValue">
      <Combobox.Anchor class="combobox-anchor"><Combobox.Input :id="inputId" :aria-label="label" :display-value="(value) => String(value ?? '')" :disabled="disabled" /></Combobox.Anchor>
      <Combobox.Portal><Combobox.Content class="combobox-content" position="popper" side="bottom" align="start" :side-offset="4"><Combobox.Viewport class="combobox-viewport"><Combobox.Item v-for="option in options" :key="option" :value="option" class="combobox-item">{{ option }}</Combobox.Item></Combobox.Viewport></Combobox.Content></Combobox.Portal>
    </Combobox.Root>
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import { useId } from 'vue'
import { Combobox } from 'reka-ui/namespaced'
defineProps<{ label: string; modelValue: string; options: string[]; error?: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const inputId = useId()
const updateValue = (value: unknown) => { if (typeof value === 'string') emit('update:modelValue', value) }
</script>
<style scoped>
.field { display: grid; gap: 6px; }.field label { font-size: 12px; font-weight: 700; }.combobox-anchor { display: block; }.field input { border: 1px solid #d4ded4; border-radius: 6px; padding: 10px; width: 100%; }.error { color: #a23f35; font-size: 12px; }
:global(.combobox-content) { z-index: 10; min-width: var(--reka-combobox-trigger-width); max-height: min(320px, var(--reka-combobox-content-available-height, 320px)); overflow: hidden; border: 1px solid #d4ded4; border-radius: 6px; background: #fbfcf9; box-shadow: 0 8px 20px rgb(29 41 37 / 14%); }
:global(.combobox-viewport) { max-height: inherit; overflow-y: auto; padding: 4px; }.combobox-item { cursor: pointer; padding: 8px 10px; }.combobox-item[data-highlighted] { background: #e5eee3; outline: none; }
</style>
