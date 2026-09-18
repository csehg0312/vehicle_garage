<template>
  <div class="field">
    <label :for="inputId">{{ label }}</label>
    <input :id="inputId" :value="modelValue" :disabled="disabled" :aria-invalid="Boolean(error)" @input="updateValue" />
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import { useId } from 'vue'
defineProps<{ label: string; modelValue: string; error?: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const inputId = useId()
const updateValue = (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
</script>
<style scoped>
.field { display: grid; gap: 6px; }.field label { font-size: 12px; font-weight: 700; }.field input { border: 1px solid #d4ded4; border-radius: 6px; padding: 10px; }.error { color: #a23f35; font-size: 12px; }
</style>