<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { DiagnosisCheck, DiagnosisEvidence, DiagnosisEvidenceKind, VehicleDiagnosis } from '../../models/vehicle'

const props = defineProps<{ diagnosis?: VehicleDiagnosis | null }>()
const emit = defineEmits<{ save: [value: VehicleDiagnosis]; cancel: []; delete: [] }>()

const newEvidence = reactive<{ kind: DiagnosisEvidenceKind; title: string; url: string; note: string }>({ kind: 'web', title: '', url: '', note: '' })
const newCheck = reactive<{ question: string; expected: string; actual: string; result: DiagnosisCheck['result']; sourceUrl: string }>({ question: '', expected: '', actual: '', result: 'pending', sourceUrl: '' })
const draft = reactive<VehicleDiagnosis>(emptyDiagnosis())

function emptyDiagnosis(): VehicleDiagnosis {
  return { id: '', symptom: '', firstObservedDate: new Date().toISOString().slice(0, 10), errorCode: '', conditions: '', safety: 'safe', suspectedCause: '', confirmedCause: '', repair: '', result: '', evidenceSource: '', evidence: [], checks: [] }
}

watch(() => props.diagnosis, (value) => Object.assign(draft, emptyDiagnosis(), value ? { ...value, evidence: [...(value.evidence ?? [])], checks: [...(value.checks ?? [])] } : {}), { immediate: true })

function addEvidence() {
  if (!newEvidence.title.trim()) return
  draft.evidence?.push({ id: makeId('evidence'), ...newEvidence, title: newEvidence.title.trim(), url: newEvidence.url.trim(), note: newEvidence.note.trim() })
  Object.assign(newEvidence, { kind: 'web', title: '', url: '', note: '' })
}

function addCheck() {
  if (!newCheck.question.trim()) return
  draft.checks?.push({ id: makeId('check'), ...newCheck, question: newCheck.question.trim(), expected: newCheck.expected.trim(), actual: newCheck.actual.trim(), sourceUrl: newCheck.sourceUrl.trim() })
  Object.assign(newCheck, { question: '', expected: '', actual: '', result: 'pending', sourceUrl: '' })
}

function save() { emit('save', { ...draft, evidence: [...(draft.evidence ?? [])], checks: [...(draft.checks ?? [])] }) }
function makeId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
</script>

<template>
  <form class="diagnosis-editor" @submit.prevent="save">
    <div class="diagnosis-editor-heading"><div><span class="editor-kicker">{{ diagnosis ? 'EDIT CASE' : 'NEW CASE' }}</span><h3>{{ diagnosis ? 'Update diagnosis case' : 'Capture the concern' }}</h3></div><button class="button button-outline" type="button" @click="emit('cancel')">Close</button></div>
    <div class="edit-grid"><label>Symptom<input v-model="draft.symptom" required placeholder="What does the car do?" /></label><label>First observed<input v-model="draft.firstObservedDate" type="date" required /></label><label>Warning / code<input v-model="draft.errorCode" placeholder="P0300 or dashboard symbol" /></label><label class="wide-field">Conditions<textarea v-model="draft.conditions" rows="2" placeholder="When, where, speed, load, hot/cold, weather, recent work" /></label><label>Safety<select v-model="draft.safety"><option value="safe">Safe to inspect</option><option value="caution">Use caution / workshop soon</option><option value="stop">Stop driving</option></select></label><label>Suspected cause<input v-model="draft.suspectedCause" /></label><label>Confirmed cause<input v-model="draft.confirmedCause" /></label><label>Repair / action<input v-model="draft.repair" /></label><label>Outcome / verification<input v-model="draft.result" placeholder="What happened after repair?" /></label></div>

    <section class="editor-subsection"><div class="subsection-heading"><div><span class="editor-kicker">EVIDENCE</span><h4>Sources and observations</h4></div><span>{{ draft.evidence?.length ?? 0 }} attached</span></div><div class="inline-fields"><select v-model="newEvidence.kind" aria-label="Evidence type"><option value="web">Web page</option><option value="image">Image URL</option><option value="video">Video</option><option value="audio">Audio</option><option value="obd">OBD scan</option><option value="measurement">Measurement</option><option value="document">Document</option></select><input v-model="newEvidence.title" placeholder="Title" aria-label="Evidence title" /><input v-model="newEvidence.url" placeholder="URL or file reference" aria-label="Evidence URL" /><input v-model="newEvidence.note" placeholder="What does it show?" aria-label="Evidence note" /><button class="button button-soft" type="button" @click="addEvidence">Add</button></div><ul v-if="draft.evidence?.length" class="editor-list"><li v-for="item in draft.evidence" :key="item.id"><span><strong>{{ item.title }}</strong><small>{{ item.kind }}<template v-if="item.note"> · {{ item.note }}</template></small></span><a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">Open</a><button type="button" aria-label="Remove evidence" @click="draft.evidence?.splice(draft.evidence.indexOf(item), 1)">×</button></li></ul></section>

    <section class="editor-subsection"><div class="subsection-heading"><div><span class="editor-kicker">CHECKS</span><h4>Test one question at a time</h4></div><span>{{ draft.checks?.length ?? 0 }} recorded</span></div><div class="check-fields"><input v-model="newCheck.question" placeholder="Question to answer" aria-label="Check question" /><input v-model="newCheck.expected" placeholder="Expected result" aria-label="Expected result" /><input v-model="newCheck.actual" placeholder="Actual result" aria-label="Actual result" /><select v-model="newCheck.result" aria-label="Check result"><option value="pending">Pending</option><option value="pass">Pass</option><option value="fail">Fail</option><option value="unknown">Unknown</option></select><input v-model="newCheck.sourceUrl" placeholder="Manual/source URL" aria-label="Check source" /><button class="button button-soft" type="button" @click="addCheck">Add</button></div><ul v-if="draft.checks?.length" class="editor-list"><li v-for="item in draft.checks" :key="item.id"><span><strong>{{ item.question }}</strong><small>{{ item.result }} · expected: {{ item.expected || 'not set' }} · actual: {{ item.actual || 'not set' }}</small></span><button type="button" aria-label="Remove check" @click="draft.checks?.splice(draft.checks.indexOf(item), 1)">×</button></li></ul></section>

    <div class="edit-actions"><button class="button button-primary" type="submit">Save case</button><button v-if="diagnosis" class="button danger-button" type="button" @click="emit('delete')">Delete case</button></div>
  </form>
</template>

<style scoped>
.diagnosis-editor { display: grid; gap: 18px; margin: 18px 0 26px; padding: 18px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-muted); }.diagnosis-editor-heading, .subsection-heading, .inline-fields, .check-fields, .editor-list li { display: flex; align-items: center; justify-content: space-between; gap: 10px; }.diagnosis-editor-heading h3, .editor-subsection h4 { margin: 5px 0 0; }.editor-kicker { color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: 1.2px; }.wide-field { grid-column: 1 / -1; }.edit-grid textarea { width: 100%; box-sizing: border-box; resize: vertical; border: 1px solid var(--line); border-radius: 6px; padding: 10px; background: var(--surface); color: var(--ink); }.editor-subsection { display: grid; gap: 12px; padding-top: 16px; border-top: 1px solid var(--line); }.subsection-heading > span { color: var(--muted); font-size: 12px; }.inline-fields > *, .check-fields > * { min-width: 0; flex: 1; border: 1px solid var(--line); border-radius: 6px; padding: 9px; background: var(--surface); color: var(--ink); }.inline-fields .button, .check-fields .button { flex: 0 0 auto; border: 0; }.editor-list { display: grid; gap: 7px; list-style: none; margin: 0; padding: 0; }.editor-list li { padding: 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }.editor-list li > span { display: grid; gap: 3px; min-width: 0; }.editor-list small { color: var(--muted); font-size: 11px; }.editor-list a { color: var(--brand-soft); font-size: 12px; }.editor-list button { border: 0; background: transparent; color: var(--danger); cursor: pointer; font-size: 18px; }.danger-button { color: var(--danger); border: 1px solid currentColor; background: transparent; }
.edit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }.edit-grid label { display: grid; gap: 6px; color: var(--muted); font-size: 11px; font-weight: 700; }.edit-grid input, .edit-grid select { width: 100%; min-height: 42px; box-sizing: border-box; border: 1px solid var(--line); border-radius: 6px; padding: 9px 10px; background: var(--surface); color: var(--ink); }
@media (max-width: 760px) { .diagnosis-editor { padding: 14px; }.edit-grid { grid-template-columns: 1fr; }.inline-fields, .check-fields { align-items: stretch; flex-direction: column; }.inline-fields > *, .check-fields > * { width: 100%; flex: auto; }.edit-actions { flex-direction: column; }.edit-actions .button { width: 100%; min-height: 44px; } }
</style>
