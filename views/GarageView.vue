<template>
  <section class="garage-page">
    <header class="page-heading">
      <div><span class="eyebrow">{{ t('garage.eyebrow') }}</span><h2>{{ t('garage.title') }}</h2><p>{{ t('garage.description') }}</p></div>
      <div class="heading-actions"><button class="button button-secondary" type="button" @click="exportBackup">{{ t('garage.export') }}</button><button class="button button-secondary" type="button" @click="fileInput?.click()">{{ t('garage.import') }}</button><input ref="fileInput" class="file-input" type="file" accept="application/json,.json" @change="importBackup" /><RouterLink class="button button-primary" to="/vehicles/new"><span aria-hidden="true">+</span> {{ t('garage.add') }}</RouterLink></div>
    </header>
    <div class="metrics-row">
      <article class="metric"><span>{{ t('garage.vehicles') }}</span><strong>{{ vehicleStore.vehicles.length }}</strong><small>{{ t('garage.inGarage') }}</small></article>
	<article class="metric"><span>{{ t('garage.cost') }}</span><strong>{{ formatCurrency(totalOwnershipCost) }}</strong><small>{{ t('garage.across') }}</small></article>
      <article class="metric"><span>{{ t('garage.mileage') }}</span><strong>{{ formatNumber(totalMileage) }} km</strong><small>and counting</small></article>
    </div>
    <div class="list-heading"><div><span class="eyebrow">{{ t('garage.collection') }}</span><h3>{{ t('garage.yourVehicles') }}</h3></div><span>{{ vehicleStore.vehicles.length }} {{ t('garage.count') }}</span></div><p v-if="backupMessage" class="backup-message" role="status">{{ backupMessage }}</p>
    <div class="vehicle-grid">
      <article v-for="vehicle in vehicleStore.vehicles" :key="vehicle.id" class="vehicle-card">
        <div class="vehicle-image" :class="vehicle.id"><span>{{ vehicle.make.charAt(0) }}{{ vehicle.model.charAt(0) }}</span><small>{{ vehicle.color }}</small></div>
        <div class="vehicle-card-body"><div class="vehicle-title"><div><h3>{{ vehicle.make }} {{ vehicle.model }}</h3><p>{{ vehicle.year }} / {{ vehicle.engine }} / {{ vehicle.fuelType }}</p></div><span class="vehicle-index">{{ vehicle.id === 'honda-civic' ? '01' : '02' }}</span></div><div class="vehicle-stats"><div><span>ODOMETER</span><strong>{{ formatNumber(vehicle.odometer) }} km</strong></div><div><span>OWNERSHIP COST</span><strong>{{ formatCurrency(vehicle.ownershipCost) }}</strong></div></div><RouterLink class="card-link" :to="`/vehicles/${vehicle.id}`">Open vehicle <span aria-hidden="true">↗</span></RouterLink></div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'
import { isMaintenanceRecord, useMaintenanceStore, type MaintenanceRecord } from '../stores/maintenance'
import { useI18n } from '../services/i18n'
const vehicleStore = useVehiclesStore()
const maintenanceStore = useMaintenanceStore()
const { t } = useI18n()
const fileInput = ref<HTMLInputElement>()
const backupMessage = ref('')
const totalMileage = computed(() => vehicleStore.vehicles.reduce((total, vehicle) => total + vehicle.odometer, 0))
const totalOwnershipCost = computed(() => vehicleStore.totalOwnershipCost + maintenanceStore.records.reduce((total, record) => total + record.cost, 0))
const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
function exportBackup() {
	const backup = { version: 2, exportedAt: new Date().toISOString(), vehicles: vehicleStore.vehicles, maintenance: maintenanceStore.records }
	const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `vehicle-garage-${new Date().toISOString().slice(0, 10)}.json`
	link.click()
	URL.revokeObjectURL(url)
	backupMessage.value = t('garage.exported')
}

async function importBackup(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return
	try {
		const data = JSON.parse(await file.text())
		const vehicles = Array.isArray(data) ? data : data?.vehicles
		const maintenance = Array.isArray(data) ? maintenanceStore.records : data?.maintenance
		if (!Array.isArray(vehicles)) throw new Error('Backup must contain a vehicle list')
		if (!Array.isArray(maintenance) || !maintenance.every(isMaintenanceRecord)) throw new Error('Backup must contain valid maintenance records')
		vehicleStore.replaceVehicles(vehicles)
		maintenanceStore.replaceRecords(maintenance as MaintenanceRecord[])
		backupMessage.value = t('garage.imported')
	} catch (error) {
		backupMessage.value = error instanceof Error ? error.message : 'Backup import failed'
	} finally {
		input.value = ''
	}
}
</script>

<style scoped>
.page-heading, .list-heading, .vehicle-title, .vehicle-stats { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }.eyebrow { color: var(--muted); font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }.page-heading h2 { font: 700 34px 'Space Grotesk'; margin: 9px 0 5px; letter-spacing: -1px; }.page-heading p { color: var(--muted); margin: 0; }.heading-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }.button { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 7px; padding: 12px 17px; font-weight: 700; text-decoration: none; cursor: pointer; }.button-primary { background: var(--accent); color: var(--accent-ink); }.button-secondary { border: 1px solid var(--line); background: var(--surface); color: var(--brand-soft); }.button-primary span { font-size: 18px; }.file-input { display: none; }.backup-message { color: var(--brand-soft); font-size: 12px; margin: 10px 0 0; }.metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 38px 0 44px; }.metric { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 20px; box-shadow: var(--shadow); }.metric span, .metric small, .vehicle-stats span { display: block; color: var(--muted); font-size: 11px; }.metric strong { display: block; color: var(--brand-soft); font: 700 25px 'Space Grotesk'; margin: 12px 0 4px; }.metric small { color: #9aa59c; }.list-heading { align-items: end; border-bottom: 1px solid var(--line); padding-bottom: 12px; }.list-heading h3 { font: 600 18px 'Space Grotesk'; margin: 8px 0 0; }.list-heading > span { color: var(--muted); font-size: 12px; }.vehicle-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 20px; }.vehicle-card { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow); }.vehicle-image { height: 170px; padding: 18px; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(135deg, #b7c9b8, #416759); color: rgba(255,255,255,.6); }.vehicle-image.lada-samara { background: linear-gradient(135deg, #aabac1, #3d6470); }.vehicle-image > span { font: 700 64px 'Space Grotesk'; letter-spacing: -5px; }.vehicle-image small { position: absolute; bottom: 14px; left: 16px; color: rgba(255,255,255,.8); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }.vehicle-card-body { padding: 20px; }.vehicle-title h3 { font: 600 18px 'Space Grotesk'; margin: 0 0 5px; }.vehicle-title p { color: var(--muted); font-size: 12px; margin: 0; }.vehicle-index { color: var(--focus); font: 700 12px 'Space Grotesk'; }.vehicle-stats { border-top: 1px solid var(--line); margin-top: 20px; padding-top: 15px; }.vehicle-stats strong { color: var(--brand-soft); font: 600 14px 'Space Grotesk'; display: block; margin-top: 6px; }.card-link { display: flex; justify-content: space-between; margin-top: 22px; color: var(--brand-soft); font-size: 12px; font-weight: 700; text-decoration: none; }.card-link:hover { color: var(--focus); }
@media (max-width: 740px) { .metrics-row, .vehicle-grid { grid-template-columns: 1fr; }.page-heading { align-items: stretch; flex-direction: column; }.heading-actions { justify-content: stretch; }.heading-actions .button { flex: 1; justify-content: center; }.metric strong { font-size: 22px; } }
</style>
