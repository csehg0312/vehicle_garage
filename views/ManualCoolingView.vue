<template>
  <section class="manual-page">
    <RouterLink class="back-link" to="/vehicles/honda-civic">â† Back to Honda Civic</RouterLink>
    <div class="manual-header">
      <div>
        <span class="section-kicker">HONDA CIVIC 2001â€“2005 Â· DIGITAL SERVICE MANUAL</span>
        <h2>Cooling system</h2>
        <p>D16V1-first service knowledge for the 7th-generation Civic.</p>
      </div>
      <a class="source-button" :href="serviceManual.url" target="_blank" rel="noopener noreferrer">Primary source â†—</a>
    </div>
    <div class="manual-layout">
      <aside class="manual-nav" aria-label="Manual navigation">
        <span class="nav-label">SYSTEMS</span>
        <a class="manual-nav-link active" href="#overview">Cooling overview</a>
        <a class="manual-nav-link" href="#components">Components</a>
        <a class="manual-nav-link" href="#procedure">Coolant replacement</a>
        <a class="manual-nav-link" href="#diagnostics">Overheating diagnosis</a>
        <span class="nav-label references-label">REFERENCES</span>
        <a class="manual-nav-link" :href="ownerManual.url" target="_blank" rel="noopener noreferrer">Owner's manual â†—</a>
        <a class="manual-nav-link" :href="legacyManualUrl" target="_blank" rel="noopener noreferrer">Legacy manual â†—</a>
      </aside>
      <div class="manual-content">
        <section id="overview" class="manual-section intro-section">
          <div class="section-title"><div><span class="section-kicker">01 Â· SYSTEM OVERVIEW</span><h3>Cooling system</h3></div><span class="variant-badge">D16V1 Â· 2001â€“2005</span></div>
          <p class="lead">The cooling system manages engine temperature through coolant circulation, heat exchange, temperature sensing, and controlled airflow. Use the vehicle-specific Honda procedure when inspecting or servicing it.</p>
          <div class="system-map" aria-label="Simplified cooling system flow diagram">
            <div class="flow-node">Radiator<span>heat exchange</span></div><span class="flow-arrow">â†“</span><div class="flow-node">Thermostat<span>flow control</span></div><span class="flow-arrow">â†“</span><div class="flow-node">Engine<span>heat source</span></div><span class="flow-arrow">â†“</span><div class="flow-node">Water pump<span>circulation</span></div>
          </div>
          <div class="notice"><strong>Variant scope</strong><span>This slice is scoped to the D16V1 variant. Chassis and transmission codes remain unverified and are intentionally not generalized.</span></div>
        </section>
        <section id="components" class="manual-section">
          <div class="section-title"><div><span class="section-kicker">02 Â· COMPONENTS</span><h3>Know what to inspect</h3></div><span class="section-count">{{ coolingComponents.length }} components</span></div>
          <div class="component-grid"><article v-for="component in coolingComponents" :key="component.id" class="component-card"><div class="component-icon">{{ component.id === 'cooling-fan' ? 'â—Ś' : component.id === 'thermostat' ? 'â—' : 'â—‡' }}</div><h4>{{ component.name }}</h4><p>{{ component.function }}</p><div class="component-meta"><span>LOCATION</span><strong>{{ component.location }}</strong></div><div v-if="component.symptoms" class="symptoms"><span>SYMPTOMS</span><em v-for="symptom in component.symptoms" :key="symptom">{{ symptom }}</em></div></article></div>
        </section>
        <section id="procedure" class="manual-section procedure-section">
          <div class="section-title"><div><span class="section-kicker">03 Â· MAINTENANCE PROCEDURE</span><h3>{{ coolantProcedure.title }}</h3></div><div class="procedure-meta"><span>DIFFICULTY {{ coolantProcedure.difficulty }}/5</span><span>~{{ coolantProcedure.estimatedTimeMinutes }} MIN</span></div></div>
          <div class="warning-list"><div v-for="warning in coolantProcedure.warnings" :key="warning">âš  {{ warning }}</div></div>
          <div class="requirements"><div><span class="section-kicker">TOOLS</span><ul><li v-for="tool in coolantProcedure.tools" :key="tool">{{ tool }}</li></ul></div><div><span class="section-kicker">MATERIALS</span><ul><li v-for="part in coolantProcedure.parts" :key="part">{{ part }}</li></ul></div></div>
          <ol class="steps"><li v-for="step in coolantProcedure.steps" :key="step.order"><span class="step-number">{{ String(step.order).padStart(2, '0') }}</span><div><h4>{{ step.title }}</h4><p>{{ step.description }}</p></div></li></ol>
        </section>
        <section id="diagnostics" class="manual-section">
          <div class="section-title"><div><span class="section-kicker">04 Â· DIAGNOSTICS</span><h3>Engine overheating</h3></div><span class="section-count">Evidence-led flow</span></div>
          <div class="diagnostic-flow"><article v-for="(node, index) in overheatingDiagnostic.nodes" :key="node.id" class="diagnostic-node"><span class="diagnostic-index">{{ index + 1 }}</span><div><strong>{{ node.question }}</strong><p v-if="node.guidance">{{ node.guidance }}</p><div v-else class="branches"><span><b>YES</b>{{ node.yes }}</span><span><b>NO</b>{{ node.no }}</span></div></div></article></div>
        </section>
        <section class="manual-section sources-section"><div class="section-title"><div><span class="section-kicker">SOURCES</span><h3>Reference trail</h3></div></div><div class="source-list"><a v-for="reference in references" :key="reference.title" :href="reference.url" target="_blank" rel="noopener noreferrer"><span>{{ reference.source }}</span><strong>{{ reference.title }}</strong><small>{{ reference.section || 'Reference source' }} Â· Opens external source â†—</small></a></div></section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { coolingComponents, coolantReplacementProcedure, hondaCivicReferences, overheatingDiagnostic } from '../features/vehicle-manual/data/honda-civic'

const serviceManual = hondaCivicReferences.serviceManual
const ownerManual = hondaCivicReferences.ownerManual
const references = [serviceManual, ownerManual, hondaCivicReferences.servicePublication]
const coolantProcedure = coolantReplacementProcedure
const legacyManualUrl = '/manuals/honda-civic-2001-2005/index.html'
</script>

<style scoped>
.manual-page { color: #24352e; }.back-link { color: #718078; text-decoration: none; font-size: 13px; }.manual-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin: 34px 0 34px; }.section-kicker, .nav-label { color: #849288; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }.manual-header h2 { font: 700 34px 'Space Grotesk'; letter-spacing: -1.3px; margin: 9px 0 5px; }.manual-header p { margin: 0; color: #78867d; }.source-button { border: 1px solid #c8d6c8; color: #315d4e; text-decoration: none; border-radius: 7px; padding: 10px 14px; font-size: 13px; font-weight: 700; }.manual-layout { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 42px; }.manual-nav { border-right: 1px solid #dfe6dc; padding-right: 20px; }.manual-nav-link { display: block; padding: 8px 10px; margin: 5px 0; color: #718078; font-size: 12px; text-decoration: none; border-left: 2px solid transparent; }.manual-nav-link:hover, .manual-nav-link.active { color: #315d4e; border-left-color: #b9d849; background: #eef3e9; font-weight: 700; }.references-label { display: block; margin-top: 34px; }.manual-content { min-width: 0; }.manual-section { border-top: 1px solid #dfe6dc; padding: 34px 0 46px; scroll-margin-top: 20px; }.intro-section { border-top: 0; padding-top: 0; }.section-title { display: flex; justify-content: space-between; gap: 16px; align-items: flex-end; margin-bottom: 20px; }.section-title h3 { font: 600 24px 'Space Grotesk'; letter-spacing: -.7px; margin: 8px 0 0; }.variant-badge, .section-count, .procedure-meta span { color: #607c53; background: #e7efd8; border-radius: 20px; padding: 6px 10px; font-size: 10px; font-weight: 700; letter-spacing: .5px; white-space: nowrap; }.lead { color: #52635a; line-height: 1.7; max-width: 760px; }.system-map { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 28px 0; flex-wrap: wrap; }.flow-node { display: grid; place-items: center; min-width: 120px; min-height: 76px; border: 1px solid #bfd0bd; background: #fbfcf8; border-radius: 8px; color: #315d4e; font-family: 'Space Grotesk'; font-weight: 600; }.flow-node span { color: #8a988f; font: 11px 'DM Sans'; margin-top: 5px; }.flow-arrow { color: #9bb343; font-size: 22px; }.notice { display: flex; gap: 12px; border-left: 3px solid #b9d849; background: #f3f7e9; padding: 13px 15px; font-size: 12px; }.notice strong { color: #496036; white-space: nowrap; }.notice span { color: #718078; }.component-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; }.component-card { background: #fff; border: 1px solid #e1e7df; border-radius: 8px; padding: 18px; }.component-icon { color: #91ad37; font-size: 24px; }.component-card h4 { font: 600 17px 'Space Grotesk'; margin: 10px 0 5px; }.component-card p { color: #6e7f75; font-size: 13px; line-height: 1.5; min-height: 40px; }.component-meta { border-top: 1px solid #edf0eb; padding-top: 12px; margin-top: 15px; }.component-meta span, .symptoms span { display: block; color: #98a39a; font-size: 9px; letter-spacing: 1px; font-weight: 700; }.component-meta strong { display: block; color: #61736a; font-size: 12px; line-height: 1.4; margin-top: 5px; }.symptoms { margin-top: 12px; }.symptoms em { display: inline-block; color: #8a694d; background: #f6eee5; border-radius: 4px; padding: 4px 6px; margin: 6px 5px 0 0; font-size: 11px; font-style: normal; }.procedure-meta { display: flex; gap: 7px; }.procedure-meta span { background: #eef3e9; color: #5b7563; }.warning-list { display: grid; gap: 7px; color: #835b3e; background: #fff5eb; border: 1px solid #f0dcc9; border-radius: 7px; padding: 13px 16px; font-size: 12px; }.requirements { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 25px 0; }.requirements ul { margin: 10px 0 0; padding-left: 18px; color: #63746a; font-size: 13px; line-height: 1.8; }.steps { list-style: none; padding: 0; margin: 0; }.steps li { display: flex; gap: 18px; padding: 17px 0; border-top: 1px solid #e8ede6; }.step-number, .diagnostic-index { display: grid; place-items: center; flex: 0 0 32px; height: 32px; border-radius: 50%; background: #dfeac6; color: #577226; font: 700 11px 'Space Grotesk'; }.steps h4 { margin: 3px 0 5px; font: 600 15px 'Space Grotesk'; }.steps p { color: #718078; font-size: 13px; line-height: 1.5; margin: 0; }.diagnostic-flow { display: grid; gap: 11px; max-width: 760px; }.diagnostic-node { display: flex; gap: 15px; align-items: flex-start; border: 1px solid #dfe7dc; border-radius: 8px; background: #fff; padding: 15px; }.diagnostic-node strong { display: block; font: 600 14px 'Space Grotesk'; margin: 6px 0 10px; }.diagnostic-node p { color: #718078; font-size: 12px; margin: 0; line-height: 1.5; }.branches { display: flex; gap: 9px; }.branches span { flex: 1; color: #718078; background: #f4f7f1; padding: 8px; font-size: 11px; }.branches b { display: block; color: #6c8b2a; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px; }.source-list { display: grid; gap: 9px; }.source-list a { display: flex; flex-direction: column; gap: 3px; border: 1px solid #dfe7dc; border-radius: 7px; padding: 13px 15px; text-decoration: none; }.source-list a:hover { border-color: #b8ce65; background: #fbfdf7; }.source-list span { color: #6c8b2a; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }.source-list strong { color: #315d4e; font-size: 13px; }.source-list small { color: #8a978f; font-size: 11px; }
@media (max-width: 760px) { .manual-header { align-items: flex-start; flex-direction: column; }.source-button { align-self: stretch; text-align: center; }.manual-layout { display: block; }.manual-nav { display: flex; gap: 3px; overflow-x: auto; border-right: 0; border-bottom: 1px solid #dfe6dc; padding: 0 0 10px; margin-bottom: 28px; }.nav-label, .references-label { display: none; }.manual-nav-link { white-space: nowrap; margin: 0; border-left: 0; border-bottom: 2px solid transparent; }.manual-nav-link:hover, .manual-nav-link.active { border-left: 0; border-bottom-color: #b9d849; }.component-grid, .requirements { grid-template-columns: 1fr; }.section-title { align-items: flex-start; flex-direction: column; }.procedure-meta { align-self: flex-start; }.branches { flex-direction: column; } }
</style>

