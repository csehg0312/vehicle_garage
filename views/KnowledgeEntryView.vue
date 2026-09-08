<template>
  <section class="knowledge-entry">
    <RouterLink class="back-link" to="/manuals/honda-civic-2001-2005">← Knowledge base</RouterLink>
    <div v-if="entry" class="entry-layout">
      <main>
        <header class="entry-header">
          <span class="entry-category">{{ entry.category }}</span>
          <h2>{{ entry.title }}</h2>
          <p>{{ entry.summary }}</p>
        </header>
        <section class="claims">
          <span class="section-kicker">KNOWLEDGE</span>
          <h3>Claims and verification</h3>
          <article v-for="claim in entry.claims" :key="claim.id" class="claim-card">
            <div class="claim-topline">
              <span :class="['status', `status-${claim.status}`]">{{ formatStatus(claim.status) }}</span>
              <span class="claim-sources">{{ claim.sources.length }} source{{ claim.sources.length === 1 ? '' : 's' }}</span>
            </div>
            <p class="claim-statement">{{ claim.statement }}</p>
            <p v-if="claim.notes" class="claim-note">{{ claim.notes }}</p>
          </article>
        </section>
      </main>
      <aside class="entry-aside">
        <section class="aside-card">
          <span class="section-kicker">APPLICABILITY</span>
          <h3>Vehicle variant</h3>
          <p>D16V1 · European-market knowledge scope</p>
          <span class="scope-note">Exact body, transmission and market configuration still take precedence where specified.</span>
        </section>
        <section v-if="relatedEntries.length" class="aside-card">
          <span class="section-kicker">CONNECTED KNOWLEDGE</span>
          <h3>Related entries</h3>
          <nav class="related-list">
            <RouterLink v-for="related in relatedEntries" :key="related.id" :to="`/manuals/honda-civic-2001-2005/knowledge/${related.id}`">
              <span>{{ related.title }}</span>
              <small>{{ related.category }}</small>
            </RouterLink>
          </nav>
        </section>
      </aside>
    </div>
    <div v-else class="not-found">
      <span class="section-kicker">KNOWLEDGE ENTRY</span>
      <h2>Entry not found</h2>
      <p>The requested knowledge node is not registered for this vehicle.</p>
      <RouterLink to="/manuals/honda-civic-2001-2005">Return to knowledge base →</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { KnowledgeEntry, KnowledgeStatus } from '../features/vehicle-manual/domain/knowledge'
import { coolingKnowledge, hondaCivicCriticalSpecsElectronics } from '../features/vehicle-manual/knowledge/honda-civic'

const route = useRoute()
const entries: KnowledgeEntry[] = [...coolingKnowledge, ...hondaCivicCriticalSpecsElectronics]
const entryById = Object.fromEntries(entries.map((item) => [item.id, item])) as Record<string, KnowledgeEntry>
const entry = computed(() => entryById[String(route.params.entryId)])
const relatedEntries = computed(() => (entry.value?.relatedEntries ?? []).map((id) => entryById[id]).filter(Boolean))
const statusLabels: Record<KnowledgeStatus, string> = { verified: 'Verified', 'partially-verified': 'Partially verified', unverified: 'Unverified' }
function formatStatus(status: KnowledgeStatus) { return statusLabels[status] }
</script>

<style scoped>
.knowledge-entry{color:#24352e}.back-link{color:#718078;text-decoration:none;font-size:13px}.entry-layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:42px;margin-top:34px}.entry-header{max-width:760px;padding-bottom:34px;border-bottom:1px solid #dfe6dc}.entry-category,.section-kicker{color:#6c8b2a;font-size:9px;letter-spacing:1.4px;font-weight:700;text-transform:uppercase}.entry-header h2{font:700 34px 'Space Grotesk';letter-spacing:-1.2px;margin:10px 0 8px}.entry-header p{margin:0;color:#718078;line-height:1.6;font-size:14px}.claims{padding-top:32px}.claims h3{font:600 23px 'Space Grotesk';letter-spacing:-.7px;margin:7px 0 18px}.claim-card{border:1px solid #dfe7dc;border-radius:8px;padding:17px;margin-bottom:10px;background:#fff}.claim-topline{display:flex;justify-content:space-between;align-items:center;gap:12px}.status{border-radius:20px;padding:5px 9px;font-size:9px;font-weight:700;letter-spacing:.4px}.status-verified{color:#4f7025;background:#e7efd8}.status-partially-verified{color:#856b27;background:#f2ead0}.status-unverified{color:#8a5a55;background:#f1e1df}.claim-sources{color:#9aa69e;font-size:10px}.claim-statement{color:#3f4f48;line-height:1.6;font-size:13px;margin:13px 0 0}.claim-note{color:#7b8780;border-left:2px solid #d7e1cd;padding-left:10px;font-size:11px;line-height:1.5;margin:12px 0 0}.entry-aside{display:flex;flex-direction:column;gap:12px}.aside-card{border:1px solid #dfe7dc;border-radius:8px;padding:17px;background:#fbfcf8}.aside-card h3{font:600 15px 'Space Grotesk';margin:8px 0;color:#315d4e}.aside-card p{color:#718078;font-size:12px;line-height:1.5;margin:0}.scope-note{display:block;color:#8b958f;font-size:10px;line-height:1.5;margin-top:10px}.related-list{display:grid;gap:5px}.related-list a{display:grid;gap:3px;padding:8px;color:#315d4e;text-decoration:none;border-radius:5px}.related-list a:hover{background:#eef3e9}.related-list span{font-size:12px}.related-list small{color:#8b958f;font-size:9px;text-transform:uppercase;letter-spacing:.8px}.not-found{max-width:560px;margin:70px auto;text-align:center}.not-found h2{font:700 28px 'Space Grotesk';margin:10px 0}.not-found p{color:#718078;font-size:13px;margin-bottom:18px}.not-found a{color:#607c53;font-size:12px;font-weight:700;text-decoration:none}@media(max-width:760px){.entry-layout{display:block}.entry-aside{margin-top:30px}.entry-header h2{font-size:28px}}
</style>
