<script setup lang="ts">
import { reactive, watch } from 'vue'
import type {
  ElectricalSpecification,
  FastenerSpecification,
  FluidSpecification,
  MaintenanceSpecification,
  TechnicalSource,
  TireSpecification,
  TorqueSpecification,
  VehicleTechnicalReference,
  VehicleSystem,
} from '../../models/technicalReference'

const props = defineProps<{
  modelValue: VehicleTechnicalReference
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VehicleTechnicalReference]
}>()

const systems: VehicleSystem[] = [
  'engine', 'transmission', 'drivetrain', 'brakes', 'suspension', 'steering',
  'body', 'electrical', 'cooling', 'fuel', 'exhaust', 'intake', 'hvac', 'wheels', 'other',
]

const sourceKinds: TechnicalSource['kind'][] = [
  'manufacturer-manual', 'service-manual', 'owner-manual', 'parts-catalog',
  'technical-bulletin', 'measurement', 'web', 'other',
]

const clone = (value: VehicleTechnicalReference): VehicleTechnicalReference =>
  JSON.parse(JSON.stringify(value))

const draft = reactive<VehicleTechnicalReference>(clone(props.modelValue))

watch(
  () => props.modelValue,
  value => Object.assign(draft, clone(value)),
  { deep: true },
)

function publish() {
  emit('update:modelValue', clone(draft))
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function addTorque() {
  draft.torqueSpecifications.push({
    id: makeId('torque'),
    system: 'engine',
    component: '',
    fastener: '',
    stages: [{ step: 1 }],
  })
  publish()
}

function addDirectTorque(item: TorqueSpecification) {
  item.torque = { value: 0.1, unit: 'Nm' }
  publish()
}

function addFluid() {
  draft.fluidSpecifications.push({
    id: makeId('fluid'),
    system: 'engine',
    fluid: '',
    specification: '',
  })
  publish()
}

function addMaintenance() {
  draft.maintenanceSpecifications.push({
    id: makeId('maintenance'),
    system: 'engine',
    item: '',
  })
  publish()
}

function addTire() {
  draft.tireSpecifications.push({
    id: makeId('tire'),
    position: 'all',
    size: '',
  })
  publish()
}

function addElectrical() {
  draft.electricalSpecifications.push({
    id: makeId('electrical'),
    system: 'electrical',
    circuit: '',
  })
  publish()
}

function addFastener() {
  draft.fastenerSpecifications.push({
    id: makeId('fastener'),
    system: 'engine',
    component: '',
    fastener: '',
  })
  publish()
}

function removeItem<T>(items: T[], index: number) {
  items.splice(index, 1)
  publish()
}

function sourceLabel(source?: TechnicalSource) {
  if (!source) return 'No source recorded'
  return [source.title, source.page ? `p. ${source.page}` : '', source.reference].filter(Boolean).join(' · ')
}

function hasSource(source?: TechnicalSource) {
  return Boolean(source?.title || source?.url || source?.reference || source?.page || source?.note)
}

function capacityLabel(item: FluidSpecification) {
  if (item.capacityLitres !== undefined) return `${item.capacityLitres} L`
  if (item.capacityRangeLitres) return `${item.capacityRangeLitres.min}–${item.capacityRangeLitres.max} L`
  return ''
}

function torqueLabel(item: TorqueSpecification) {
  if (item.torque) return `${item.torque.value} ${item.torque.unit}`
  if (item.stages?.length) return `${item.stages.length} stages`
  return 'Procedure'
}
</script>

<template>
  <div class="technical-reference-editor">
    <div class="reference-overview">
      <div>
        <span class="reference-kicker">Vehicle-specific technical data</span>
        <h3>Technical reference</h3>
        <p>Structured values for service, diagnostics and future vehicle-data integrations.</p>
      </div>
      <span class="reference-count">
        {{ draft.torqueSpecifications.length + draft.fluidSpecifications.length + draft.maintenanceSpecifications.length + draft.tireSpecifications.length + draft.electricalSpecifications.length + draft.fastenerSpecifications.length }}
        entries
      </span>
    </div>

    <section class="reference-section" data-section="torque">
      <header class="reference-section-header">
        <div><span class="section-icon">T</span><div><h4>Torque specifications</h4><p>Fastener tightening values and procedures.</p></div></div>
        <button class="reference-add" data-action="add-torque" type="button" @click="addTorque">Add torque</button>
      </header>
      <div v-if="draft.torqueSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.torqueSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading">
            <div><strong>{{ item.component || 'New torque specification' }}</strong><span>{{ item.fastener || 'Fastener not defined' }}</span></div>
            <button class="item-remove" type="button" @click="removeItem(draft.torqueSpecifications, index)">Remove</button>
          </div>
          <div class="reference-grid">
            <label>System<select v-model="item.system" @change="publish"><option v-for="system in systems" :key="system" :value="system">{{ system }}</option></select></label>
            <label>Component<input v-model="item.component" placeholder="Brake caliper" @change="publish" /></label>
            <label>Fastener<input v-model="item.fastener" placeholder="Mounting bolt" @change="publish" /></label>
            <label>Torque<template v-if="item.torque"><span class="compound-field"><input v-model.number="item.torque.value" type="number" min="0" step="0.1" @change="publish" /><select v-model="item.torque.unit" @change="publish"><option>Nm</option><option>lb-ft</option><option>kgf-m</option></select></span></template><button v-else class="inline-action" type="button" @click="addDirectTorque(item)">Set direct torque</button></label>
          </div>
          <div v-if="item.stages?.length" class="stage-list">
            <div v-for="stage in item.stages" :key="stage.step" class="stage-row"><span>Stage {{ stage.step }}</span><strong>{{ stage.torque ? `${stage.torque.value} ${stage.torque.unit}` : stage.angleDeg ? `${stage.angleDeg}°` : stage.description }}</strong></div>
          </div>
          <p v-if="item.conditions?.length" class="item-note">{{ item.conditions.join(' · ') }}</p>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No torque specifications recorded.</p>
    </section>

    <section class="reference-section" data-section="fluids">
      <header class="reference-section-header">
        <div><span class="section-icon">F</span><div><h4>Fluids & capacities</h4><p>Fluid specification, capacity and fill context.</p></div></div>
        <button class="reference-add" type="button" @click="addFluid">Add fluid</button>
      </header>
      <div v-if="draft.fluidSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.fluidSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading"><div><strong>{{ item.fluid || 'New fluid specification' }}</strong><span>{{ item.specification || 'Specification not defined' }}<template v-if="capacityLabel(item)"> · {{ capacityLabel(item) }}</template></span></div><button class="item-remove" type="button" @click="removeItem(draft.fluidSpecifications, index)">Remove</button></div>
          <div class="reference-grid">
            <label>System<select v-model="item.system" @change="publish"><option v-for="system in systems" :key="system" :value="system">{{ system }}</option></select></label>
            <label>Fluid<input v-model="item.fluid" placeholder="Engine oil" @change="publish" /></label>
            <label>Specification<input v-model="item.specification" placeholder="5W-30" @change="publish" /></label>
            <label>Capacity (L)<input v-model.number="item.capacityLitres" type="number" min="0" step="0.1" @change="publish" /></label>
          </div>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No fluid specifications recorded.</p>
    </section>

    <section class="reference-section" data-section="maintenance">
      <header class="reference-section-header">
        <div><span class="section-icon">M</span><div><h4>Maintenance intervals</h4><p>Service intervals tied to a specific vehicle system.</p></div></div>
        <button class="reference-add" type="button" @click="addMaintenance">Add interval</button>
      </header>
      <div v-if="draft.maintenanceSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.maintenanceSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading"><div><strong>{{ item.item || 'New maintenance item' }}</strong><span>{{ item.intervalKm ? `Every ${item.intervalKm.toLocaleString()} km` : item.intervalMonths ? `Every ${item.intervalMonths} months` : item.intervalDescription || 'Interval not defined' }}</span></div><button class="item-remove" type="button" @click="removeItem(draft.maintenanceSpecifications, index)">Remove</button></div>
          <div class="reference-grid">
            <label>System<select v-model="item.system" @change="publish"><option v-for="system in systems" :key="system" :value="system">{{ system }}</option></select></label>
            <label>Item<input v-model="item.item" placeholder="Spark plugs" @change="publish" /></label>
            <label>Interval km<input v-model.number="item.intervalKm" type="number" min="0" step="1000" @change="publish" /></label>
            <label>Interval months<input v-model.number="item.intervalMonths" type="number" min="0" step="1" @change="publish" /></label>
          </div>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No maintenance intervals recorded.</p>
    </section>

    <section class="reference-section" data-section="tires">
      <header class="reference-section-header">
        <div><span class="section-icon">W</span><div><h4>Wheels & tires</h4><p>Fitment and pressure data for this vehicle.</p></div></div>
        <button class="reference-add" type="button" @click="addTire">Add tire spec</button>
      </header>
      <div v-if="draft.tireSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.tireSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading"><div><strong>{{ item.size || 'New tire specification' }}</strong><span>{{ item.position || 'all' }}<template v-if="item.pressureBar"> · {{ item.pressureBar }} bar</template></span></div><button class="item-remove" type="button" @click="removeItem(draft.tireSpecifications, index)">Remove</button></div>
          <div class="reference-grid">
            <label>Position<select v-model="item.position" @change="publish"><option value="all">All</option><option value="front">Front</option><option value="rear">Rear</option></select></label>
            <label>Size<input v-model="item.size" placeholder="205/55 R16" @change="publish" /></label>
            <label>Pressure bar<input v-model.number="item.pressureBar" type="number" min="0" step="0.1" @change="publish" /></label>
            <label>Pressure kPa<input v-model.number="item.pressureKpa" type="number" min="0" step="1" @change="publish" /></label>
          </div>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No tire specifications recorded.</p>
    </section>

    <section class="reference-section" data-section="electrical">
      <header class="reference-section-header">
        <div><span class="section-icon">E</span><div><h4>Electrical</h4><p>Fuses, relays, connectors and circuit references.</p></div></div>
        <button class="reference-add" type="button" @click="addElectrical">Add electrical</button>
      </header>
      <div v-if="draft.electricalSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.electricalSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading"><div><strong>{{ item.circuit || 'New electrical specification' }}</strong><span>{{ item.ratingAmps ? `${item.ratingAmps} A` : item.connector || 'Circuit not defined' }}</span></div><button class="item-remove" type="button" @click="removeItem(draft.electricalSpecifications, index)">Remove</button></div>
          <div class="reference-grid">
            <label>System<select v-model="item.system" @change="publish"><option v-for="system in systems" :key="system" :value="system">{{ system }}</option></select></label>
            <label>Circuit<input v-model="item.circuit" placeholder="Fuel pump" @change="publish" /></label>
            <label>Fuse<input v-model="item.fuse" placeholder="15 A" @change="publish" /></label>
            <label>Relay<input v-model="item.relay" placeholder="Main relay" @change="publish" /></label>
            <label>Rating (A)<input v-model.number="item.ratingAmps" type="number" min="0" step="1" @change="publish" /></label>
            <label>Connector<input v-model="item.connector" placeholder="C101" @change="publish" /></label>
          </div>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No electrical specifications recorded.</p>
    </section>

    <section class="reference-section" data-section="fasteners">
      <header class="reference-section-header">
        <div><span class="section-icon">B</span><div><h4>Fasteners</h4><p>Thread, grade, replacement and lubrication requirements.</p></div></div>
        <button class="reference-add" type="button" @click="addFastener">Add fastener</button>
      </header>
      <div v-if="draft.fastenerSpecifications.length" class="reference-list">
        <article v-for="(item, index) in draft.fastenerSpecifications" :key="item.id" class="reference-item">
          <div class="item-heading"><div><strong>{{ item.component || 'New fastener specification' }}</strong><span>{{ item.fastener || 'Fastener not defined' }}</span></div><button class="item-remove" type="button" @click="removeItem(draft.fastenerSpecifications, index)">Remove</button></div>
          <div class="reference-grid">
            <label>System<select v-model="item.system" @change="publish"><option v-for="system in systems" :key="system" :value="system">{{ system }}</option></select></label>
            <label>Component<input v-model="item.component" placeholder="Wheel hub" @change="publish" /></label>
            <label>Fastener<input v-model="item.fastener" placeholder="Wheel nut" @change="publish" /></label>
            <label>Thread<input v-model="item.thread" placeholder="M12 x 1.5" @change="publish" /></label>
            <label>Grade<input v-model="item.grade" placeholder="10.9" @change="publish" /></label>
            <label>Quantity<input v-model.number="item.quantity" type="number" min="1" step="1" @change="publish" /></label>
          </div>
          <small v-if="hasSource(item.source)" class="item-source">{{ sourceLabel(item.source) }}</small>
        </article>
      </div>
      <p v-else class="empty-reference">No fastener specifications recorded.</p>
    </section>
  </div>
</template>

<style scoped>
.technical-reference-editor {
  display: grid;
  gap: 14px;
}

.reference-overview {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 12px;
  background: var(--brand);
  color: #fff;
}

.reference-overview h3 {
  margin: 5px 0;
  font: 700 24px 'Space Grotesk';
}

.reference-overview p {
  max-width: 58ch;
  margin: 0;
  color: #b6cbbd;
  font-size: 12px;
  line-height: 1.5;
}

.reference-kicker {
  color: #a4c0ae;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.reference-count {
  flex: 0 0 auto;
  padding: 7px 9px;
  border: 1px solid #567164;
  border-radius: 999px;
  color: #d8e7dc;
  font-size: 11px;
  white-space: nowrap;
}

.reference-section {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.reference-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.reference-section-header > div {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.section-icon {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 8px;
  background: var(--surface-muted);
  color: var(--brand-soft);
  font-weight: 800;
}

.reference-section h4 {
  margin: 2px 0 3px;
  color: var(--brand-soft);
  font: 700 16px 'Space Grotesk';
}

.reference-section-header p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.reference-add,
.item-remove {
  min-height: 38px;
  padding: 8px 11px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface);
  color: var(--brand-soft);
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.reference-add {
  background: var(--surface-muted);
}

.reference-list {
  display: grid;
  gap: 10px;
}

.reference-item {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-muted);
}

.item-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.item-heading > div {
  min-width: 0;
}

.item-heading strong,
.item-heading span {
  display: block;
}

.item-heading strong {
  color: var(--brand-soft);
  font-size: 13px;
}

.item-heading span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.reference-grid label {
  display: grid;
  align-content: start;
  gap: 5px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
}

.reference-grid input,
.reference-grid select {
  width: 100%;
  min-width: 0;
  min-height: 40px;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
}

.reference-grid label:nth-child(4) {
  grid-column: span 1;
}

.stage-list {
  display: grid;
  gap: 6px;
}

.stage-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-left: 3px solid var(--accent);
  background: var(--surface);
  font-size: 11px;
}

.stage-row span {
  color: var(--muted);
}

.item-note,
.item-source {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .reference-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .reference-overview {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }

  .reference-section {
    padding: 12px;
    border-radius: 9px;
  }

  .reference-section-header {
    flex-direction: column;
  }

  .reference-add {
    width: 100%;
    min-height: 44px;
  }

  .reference-grid {
    grid-template-columns: 1fr;
  }

  .reference-grid input,
  .reference-grid select {
    min-height: 44px;
    font-size: 16px;
  }

  .item-heading {
    align-items: flex-start;
  }

  .item-remove {
    flex: 0 0 auto;
    min-height: 40px;
  }
}
</style>
