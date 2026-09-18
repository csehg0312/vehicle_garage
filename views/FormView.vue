<template>
	<section class="form-page">
		<div class="section-heading">
			<div><span class="section-kicker">{{ t('form.eyebrow') }}</span><h2>{{ t('form.title') }}</h2><p>{{ t('form.description') }}</p></div>
		</div>
		<form class="vehicle-form" @submit.prevent="submitForm" novalidate>
			<BaseCombobox v-model="form.make" :label="t('form.manufacturer')" placeholder="Select manufacturer" :options="makeOptions" :disabled="catalogLoading && !makes.length" />
			<BaseCombobox v-model="form.model" :label="t('form.model')" placeholder="Select model" :options="modelOptions" :disabled="!form.make || catalogLoading" />
			<BaseCombobox v-model="selectedYear" :label="t('form.year')" placeholder="Select year" :options="yearOptions" :disabled="!form.model || catalogLoading" />
			<BaseCombobox v-model="selectedGeneration" :label="t('form.body')" placeholder="Select body style" :options="generationOptions" :disabled="!selectedYear || catalogLoading" />
			<BaseCombobox v-model="selectedEngine" :label="t('form.engine')" placeholder="Select engine" :options="engineOptions" :disabled="!selectedGeneration || catalogLoading" />
			<label v-if="selectedGeneration" class="body-style-toggle"><input v-model="showAllBodyStyles" type="checkbox" /> {{ t('form.crossBody') }}</label>
			<p v-if="selectedEngineChoice?.generation.name !== selectedGeneration && selectedEngineChoice" class="form-help" role="status">{{ t('form.crossBodyWarning', { generation: selectedEngineChoice.generation.name }) }}</p>
			<section v-if="selectedEngineRecord || isCustomEngine" class="technical-card" aria-labelledby="technical-data-heading">
				<div class="technical-heading"><div><span class="section-kicker">{{ isCustomEngine ? t('form.localData') : t('form.catalogData') }}</span><h3 id="technical-data-heading">{{ isCustomEngine ? t('form.addDetails') : t('form.verify') }}</h3></div><span class="technical-note">{{ t('form.editable') }}</span></div>
				<div class="technical-grid">
					<label>{{ t('form.engineCode') }}<input v-model="form.technicalData.engineCode" :placeholder="t('form.engineCodeHint')" /></label>
					<label>{{ t('form.displacement') }}<input v-model.number="form.technicalData.displacementCc" type="number" min="0" /></label>
					<label>{{ t('form.cylinders') }}<input v-model.number="form.technicalData.cylinders" type="number" min="1" /></label>
					<label>{{ t('form.power') }}<input v-model.number="form.technicalData.powerHp" type="number" min="0" /></label>
					<label>{{ t('form.torque') }}<input v-model.number="form.technicalData.torqueNm" type="number" min="0" /></label>
					<label>{{ t('form.economy') }}<input v-model.number="form.technicalData.fuelEconomyCombinedL100" type="number" min="0" step="0.1" /></label>
					<label>{{ t('form.transmission') }}<input v-model="form.technicalData.transmission" /></label>
					<label>{{ t('form.drivetrain') }}<input v-model="form.technicalData.drivetrain" /></label>
				</div>
			</section>
			<p v-if="catalogMessage" class="form-help" role="status">{{ catalogMessage }}</p>
			<BaseCombobox v-model="form.fuelType" :label="t('form.fuel')" :options="fuelTypes" />
			<label>{{ t('form.odometer') }}<input v-model.number="form.odometer" name="odometer" type="number" min="0" required /></label>
			<BaseInput v-model="form.color" :label="t('form.color')" />
			<label>{{ t('form.cost') }}<input v-model.number="form.ownershipCost" name="ownershipCost" type="number" min="0" required /></label>
			<p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
			<div class="form-actions"><RouterLink class="secondary-button" to="/garage">{{ t('form.cancel') }}</RouterLink><button class="primary-button" type="submit">{{ t('form.submit') }}</button></div>
		</form>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '../stores/vehicles'
import type { FuelType, VehicleTechnicalData } from '../models/vehicle'
import BaseInput from '../components/base/BaseInput.vue'
import { fetchCatalogMakes, fetchCatalogModels, getCatalogGenerationsForYear, getCatalogYears, type CatalogMake, type CatalogModel, type CatalogEngine } from '../services/vehicleCatalog'
import BaseCombobox from '../components/base/BaseCombobox.vue'
import { useI18n } from '../services/i18n'

const router = useRouter()
const vehicleStore = useVehiclesStore()
const { t } = useI18n()
const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const form = reactive({ make: '', model: '', year: 0, engine: '', fuelType: 'Petrol' as FuelType, odometer: 0, color: '', ownershipCost: 0, technicalData: emptyTechnicalData() })
const errorMessage = ref('')
const catalogMessage = ref('')
const catalogLoading = ref(false)
const makes = ref<CatalogMake[]>([])
const models = ref<CatalogModel[]>([])
const selectedYear = ref('')
const selectedGeneration = ref('')
const selectedEngine = ref('')
const showAllBodyStyles = ref(false)
const customEngineOption = 'I cannot find my engine'
let lookupSequence = 0
const makeOptions = computed(() => makes.value.map((make) => make.name))
const modelOptions = computed(() => models.value.map((model) => model.name))
const selectedModel = computed(() => models.value.find((model) => model.name === form.model))
const yearOptions = computed(() => selectedModel.value ? getCatalogYears(selectedModel.value).map(String) : [])
const yearGenerations = computed(() => selectedModel.value && selectedYear.value ? getCatalogGenerationsForYear(selectedModel.value, Number(selectedYear.value)) : [])
const selectedGenerationRecord = computed(() => yearGenerations.value.find((generation) => generation.name === selectedGeneration.value))
const generationOptions = computed(() => yearGenerations.value.map((generation) => generation.name))
const engineChoices = computed(() => {
	const generations = showAllBodyStyles.value ? yearGenerations.value : (selectedGenerationRecord.value ? [selectedGenerationRecord.value] : [])
	return generations.flatMap((generation) => generation.engines.map((engine) => ({ engine, generation, label: formatEngineOption(engine, showAllBodyStyles.value && generation.name !== selectedGeneration.value ? generation.name : '') })))
})
const selectedEngineChoice = computed(() => engineChoices.value.find((choice) => choice.label === selectedEngine.value))
const selectedEngineRecord = computed(() => selectedEngineChoice.value?.engine)
const isCustomEngine = computed(() => selectedEngine.value === customEngineOption)
const engineOptions = computed(() => [...engineChoices.value.map((choice) => choice.label), customEngineOption])

async function loadCatalog<T>(request: () => Promise<T>, onSuccess: (value: T) => void) {
	const sequence = ++lookupSequence
	catalogLoading.value = true
	catalogMessage.value = ''
	try {
		const value = await request()
		if (sequence === lookupSequence) onSuccess(value)
	} catch (error) {
		if (sequence === lookupSequence) catalogMessage.value = error instanceof Error ? `${error.message}. ${t('form.retryLater')}` : t('form.catalogUnavailable')
	} finally {
		if (sequence === lookupSequence) catalogLoading.value = false
	}
}

onMounted(() => {
	makes.value = fetchCatalogMakes()
})

watch(() => form.make, (name) => {
	form.model = ''
	form.engine = ''
	form.year = 0
	selectedYear.value = ''
	selectedGeneration.value = ''
	selectedEngine.value = ''
	showAllBodyStyles.value = false
	models.value = []
	const make = makes.value.find((candidate) => candidate.name === name)
	if (make) void loadCatalog(() => fetchCatalogModels(make.id), (value) => { models.value = value })
})

watch(() => form.model, (name) => {
	form.engine = ''
	form.year = 0
	selectedYear.value = ''
	selectedGeneration.value = ''
	selectedEngine.value = ''
	showAllBodyStyles.value = false
})

watch(selectedYear, (year) => {
	form.year = Number(year) || 0
	selectedGeneration.value = ''
	selectedEngine.value = ''
	showAllBodyStyles.value = false
})

watch(selectedGeneration, () => {
	selectedEngine.value = ''
	showAllBodyStyles.value = false
})

watch(selectedEngine, () => {
	const engine = selectedEngineRecord.value
	if (!engine) {
		if (isCustomEngine.value) {
			form.engine = ''
			form.technicalData = emptyTechnicalData()
		}
		return
	}
	form.engine = engine.label
	form.fuelType = normalizeFuelType(engine.fuelType)
	form.technicalData = {
		...emptyTechnicalData(),
		isCustom: false,
		catalogGeneration: selectedEngineChoice.value?.generation.name ?? '',
		displacementCc: engine.displacementCc ?? null,
		cylinders: engine.cylinders ?? null,
		powerHp: engine.powerHp ?? null,
		torqueNm: engine.torqueNm ?? null,
		transmission: engine.transmission ?? '',
		drivetrain: engine.drivetrain ?? '',
		fuelEconomyCombinedL100: engine.fuelEconomyCombinedL100 ?? null,
	}
})

function normalizeFuelType(value: string | null): FuelType {
	if (!value) return 'Petrol'
	if (/diesel/i.test(value)) return 'Diesel'
	if (/electric|battery/i.test(value)) return 'Electric'
	if (/hybrid/i.test(value)) return 'Hybrid'
	return 'Petrol'
}

function submitForm() {
	errorMessage.value = ''
	if (!makes.value.some((make) => make.name === form.make) || !selectedModel.value || !selectedGenerationRecord.value || (!isCustomEngine.value && !selectedEngineRecord.value) || form.year <= 0) {
		errorMessage.value = t('form.invalidCatalog')
		return
	}
	try {
		vehicleStore.addVehicle(form)
		router.push('/garage')
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : 'Unable to add vehicle'
	}
}

function formatEngineOption(engine: CatalogEngine, generationName = ''): string {
	const details = [engine.fuelType, engine.transmission, engine.drivetrain].filter(Boolean).join(' | ')
	const label = details ? `${engine.label} | ${details}` : engine.label
	return generationName ? `${label} | ${generationName}` : label
}

function emptyTechnicalData(): VehicleTechnicalData {
	return { engineCode: '', isCustom: true, catalogGeneration: '', displacementCc: null, cylinders: null, powerHp: null, torqueNm: null, transmission: '', drivetrain: '', fuelEconomyCombinedL100: null }
}
</script>

<style scoped>
.section-heading { margin-bottom: 28px; }.section-kicker { color: #849288; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }.section-heading h2 { font: 700 30px 'Space Grotesk'; margin: 8px 0 4px; }.section-heading p { color: #78857b; margin: 0; }.vehicle-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; max-width: 760px; background: #fff; border: 1px solid #e1e7df; border-radius: 8px; padding: 24px; }.vehicle-form label { display: grid; gap: 7px; color: #526258; font-size: 12px; font-weight: 700; }.vehicle-form input, .vehicle-form select { border: 1px solid #d4ded4; border-radius: 6px; padding: 11px 12px; color: #1d2925; background: #fbfcf9; }.form-error { grid-column: 1 / -1; color: #a23f35; margin: 0; }.form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }.primary-button, .secondary-button { display: inline-block; border-radius: 7px; padding: 12px 17px; font-weight: 700; text-decoration: none; cursor: pointer; }.primary-button { background: #d7e96e; border: 0; color: #25453b; }.secondary-button { color: #315b4e; border: 1px solid #cbd8cc; }.primary-button span { font-size: 18px; margin-right: 5px; }@media (max-width: 620px) { .vehicle-form { grid-template-columns: 1fr; }.form-actions { justify-content: stretch; }.form-actions > * { flex: 1; text-align: center; } }
.technical-card { grid-column: 1 / -1; padding: 18px; border: 1px solid #dce5da; border-radius: 8px; background: #f7faf5; }.technical-heading { display: flex; justify-content: space-between; gap: 12px; align-items: start; }.technical-heading h3 { margin: 6px 0 16px; font: 600 19px 'Space Grotesk'; }.technical-note { color: #718078; font-size: 12px; }.technical-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }.technical-grid label { font-size: 11px; }.technical-grid input { width: 100%; }
.body-style-toggle { grid-column: 1 / -1; display: flex !important; grid-template-columns: auto 1fr; align-items: center; gap: 8px !important; font-weight: 500 !important; }.body-style-toggle input { width: auto; }
</style>
