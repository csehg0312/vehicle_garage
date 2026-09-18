<template>
  <table>
    <caption>{{ label }}</caption>
    <thead><tr><th v-for="column in columns" :key="column.key" scope="col">{{ column.label }}</th></tr></thead>
    <tbody v-if="rows.length"><tr v-for="(row, index) in rows" :key="String(row[rowKey] ?? index)"><td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td></tr></tbody>
    <tbody v-else><tr><td :colspan="Math.max(columns.length, 1)" data-empty-state>No data</td></tr></tbody>
  </table>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ label: string; columns: { key: string; label: string }[]; rows: Record<string, unknown>[]; rowKey?: string }>(), { rowKey: 'id' })
</script>
<style scoped>
table { border-collapse: collapse; width: 100%; }
caption { text-align: left; font-weight: 700; margin-bottom: 8px; }
th, td { border-bottom: 1px solid #dfe6dc; padding: 10px; text-align: left; }
</style>