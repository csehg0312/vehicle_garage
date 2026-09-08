<template>
	<section class="garage-page">
		<div class="section-heading">
			<div><span class="section-kicker">YOUR COLLECTION</span><h2>Garage</h2><p>Two vehicles, one place to keep their stories.</p></div>
			<button class="primary-button" type="button"><span>+</span> Add vehicle</button>
		</div>
		<div class="metrics-row">
			<article class="metric"><span>Vehicles</span><strong>{{ vehicleStore.vehicles.length }}</strong><small>in your garage</small></article>
			<article class="metric"><span>Total ownership cost</span><strong>{{ formatCurrency(vehicleStore.totalOwnershipCost) }}</strong><small>across all vehicles</small></article>
			<article class="metric"><span>Combined mileage</span><strong>{{ formatNumber(totalMileage) }} km</strong><small>and counting</small></article>
		</div>
		<div class="list-heading"><h3>Your vehicles</h3><span>{{ vehicleStore.vehicles.length }} entries</span></div>
		<div class="vehicle-grid">
			<article v-for="vehicle in vehicleStore.vehicles" :key="vehicle.id" class="vehicle-card">
				<div class="vehicle-image" :class="vehicle.id"><span>{{ vehicle.make.charAt(0) }}{{ vehicle.model.charAt(0) }}</span><div class="image-label">{{ vehicle.color }}</div></div>
				<div class="vehicle-card-body"><div class="vehicle-title"><div><h3>{{ vehicle.make }} {{ vehicle.model }}</h3><p>{{ vehicle.year }} · {{ vehicle.engine }} · {{ vehicle.fuelType }}</p></div><span class="more">···</span></div><div class="vehicle-stats"><div><span>ODOMETER</span><strong>{{ formatNumber(vehicle.odometer) }} km</strong></div><div><span>OWNERSHIP COST</span><strong>{{ formatCurrency(vehicle.ownershipCost) }}</strong></div></div><RouterLink class="card-link" :to="`/vehicles/${vehicle.id}`">View vehicle <span>→</span></RouterLink></div>
			</article>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'

const vehicleStore = useVehiclesStore()
const totalMileage = computed(() => vehicleStore.vehicles.reduce((total, vehicle) => total + vehicle.odometer, 0))
const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
</script>

<style scoped>
.section-heading, .list-heading, .vehicle-title, .vehicle-stats { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }.section-kicker { color: #849288; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }.section-heading h2 { font: 700 30px 'Space Grotesk'; margin: 8px 0 4px; letter-spacing: -1px; }.section-heading p { color: #78857b; margin: 0; }.primary-button { background: #d7e96e; border: 0; border-radius: 7px; color: #25453b; padding: 12px 17px; font-weight: 700; cursor: pointer; }.primary-button span { font-size: 18px; margin-right: 5px; }.metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 38px 0 44px; }.metric { background: #fff; border: 1px solid #e1e7df; border-radius: 8px; padding: 20px; }.metric span, .metric small, .vehicle-stats span { display: block; color: #7c8980; font-size: 11px; }.metric strong { display: block; color: #234d41; font: 700 25px 'Space Grotesk'; margin: 12px 0 4px; }.metric small { color: #9aa59c; }.list-heading { align-items: center; border-bottom: 1px solid #dfe6dc; padding-bottom: 12px; }.list-heading h3 { font: 600 18px 'Space Grotesk'; margin: 0; }.list-heading span { color: #8b988e; font-size: 12px; }.vehicle-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 20px; }.vehicle-card { background: #fff; border: 1px solid #e1e7df; border-radius: 8px; overflow: hidden; }.vehicle-image { height: 150px; padding: 18px; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(135deg, #b4c7bb, #456b5d); color: rgba(255,255,255,.55); }.vehicle-image.lada-samara { background: linear-gradient(135deg, #a7b6c1, #3d6470); }.vehicle-image > span { font: 700 58px 'Space Grotesk'; letter-spacing: -5px; }.image-label { position: absolute; bottom: 12px; left: 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,.75); }.vehicle-card-body { padding: 20px; }.vehicle-title h3 { margin: 0 0 5px; font: 600 21px 'Space Grotesk'; }.vehicle-title p { margin: 0; color: #7a887d; font-size: 13px; }.more { color: #93a097; letter-spacing: 2px; }.vehicle-stats { margin: 26px 0 22px; border-top: 1px solid #edf0eb; border-bottom: 1px solid #edf0eb; padding: 15px 0; }.vehicle-stats > div { flex: 1; }.vehicle-stats strong { display: block; margin-top: 5px; font-size: 14px; color: #315d4e; }.card-link { display: flex; justify-content: space-between; color: #315d4e; font-size: 13px; font-weight: 700; text-decoration: none; }.card-link span { font-size: 18px; line-height: 12px; }.card-link:hover { color: #76951d; }
@media (max-width: 740px) { .metrics-row, .vehicle-grid { grid-template-columns: 1fr; }.section-heading { align-items: flex-start; flex-direction: column; }.primary-button { align-self: stretch; }.metric strong { font-size: 22px; } }
</style>
