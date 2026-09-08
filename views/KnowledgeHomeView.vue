<template>
  <section class="knowledge-home">
    <RouterLink class="back-link" to="/garage">← Back to garage</RouterLink>

    <header class="knowledge-header">
      <div>
        <span class="section-kicker">HONDA CIVIC 2001–2005 · D16V1 KNOWLEDGE BASE</span>
        <h2>Vehicle knowledge</h2>
        <p>Explore the vehicle by system, service task, symptom, or specification.</p>
      </div>
      <span class="variant-badge">D16V1 · 2001–2005</span>
    </header>

    <div class="workspace">
      <aside class="sidebar-panel" aria-label="Knowledge navigation">
        <span class="panel-label">EXPLORE</span>
        <nav>
          <a v-for="section in navigation.sections" :key="section.id" :href="`#${section.id}`" class="side-link">
            <span>{{ section.title }}</span>
            <small>{{ section.entryIds.length }}</small>
          </a>
        </nav>
      </aside>

      <main class="content-panel">
        <section class="quick-access">
          <div class="section-title">
            <div>
              <span class="section-kicker">QUICK ACCESS</span>
              <h3>Start where you need it</h3>
            </div>
          </div>
          <div class="entry-grid featured-grid">
            <RouterLink v-for="entry in pinnedEntries" :key="entry.id" :to="`/manuals/honda-civic-2001-2005/knowledge/${entry.id}`" class="entry-card featured">
              <span class="entry-category">{{ entry.category }}</span>
              <h4>{{ entry.title }}</h4>
              <p>{{ entry.summary }}</p>
              <span class="open-link">Open knowledge →</span>
            </RouterLink>
          </div>
        </section>

        <section v-for="section in navigation.sections" :key="section.id" :id="section.id" class="knowledge-section">
          <div class="section-title">
            <div>
              <span class="section-kicker">{{ section.title.toUpperCase() }}</span>
              <h3>{{ section.title }}</h3>
            </div>
            <span class="section-count">{{ section.entryIds.length }} entries</span>
          </div>
          <p class="section-description">{{ section.description }}</p>
          <div class="entry-grid">
            <RouterLink v-for="entryId in section.entryIds" :key="entryId" :to="`/manuals/honda-civic-2001-2005/knowledge/${entryId}`" class="entry-card">
              <span class="entry-category">{{ entryById[entryId]?.category }}</span>
              <h4>{{ entryById[entryId]?.title }}</h4>
              <p>{{ entryById[entryId]?.summary }}</p>
              <span class="open-link">Explore →</span>
            </RouterLink>
          </div>
        </section>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hondaCivicKnowledgeIndex } from '../features/vehicle-manual/knowledge/honda-civic'
import { hondaCivicKnowledgeNavigation } from '../features/vehicle-manual/knowledge/honda-civic/navigation'
import type { KnowledgeEntry } from '../features/vehicle-manual/domain/knowledge'
import { coolingKnowledge, hondaCivicCriticalSpecsElectronics } from '../features/vehicle-manual/knowledge/honda-civic'

const navigation = hondaCivicKnowledgeNavigation
const entries: KnowledgeEntry[] = [...coolingKnowledge, ...hondaCivicCriticalSpecsElectronics]
const entryById = Object.fromEntries(entries.map((entry) => [entry.id, entry])) as Record<string, KnowledgeEntry>

const pinnedEntries = computed(() =>
  (navigation.pinnedEntryIds ?? []).map((id) => entryById[id]).filter(Boolean),
)

void hondaCivicKnowledgeIndex
</script>

<style scoped>
.knowledge-home { color: #24352e; }
.back-link { color: #718078; text-decoration: none; font-size: 13px; }
.knowledge-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin: 34px 0; }
.section-kicker, .panel-label { color: #849288; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }
.knowledge-header h2 { font: 700 34px 'Space Grotesk'; letter-spacing: -1.3px; margin: 9px 0 5px; }
.knowledge-header p, .section-description { margin: 0; color: #78867d; }
.variant-badge, .section-count { color: #607c53; background: #e7efd8; border-radius: 20px; padding: 6px 10px; font-size: 10px; font-weight: 700; letter-spacing: .5px; white-space: nowrap; }
.workspace { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 42px; }
.sidebar-panel { border-right: 1px solid #dfe6dc; padding-right: 20px; }
.sidebar-panel nav { margin-top: 14px; }
.side-link { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 4px 0; color: #718078; text-decoration: none; font-size: 12px; border-left: 2px solid transparent; }
.side-link:hover { color: #315d4e; border-left-color: #b9d849; background: #eef3e9; }
.side-link small { color: #9aa69e; }
.content-panel { min-width: 0; }
.section-title { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 18px; }
.section-title h3 { font: 600 23px 'Space Grotesk'; letter-spacing: -.7px; margin: 8px 0 0; }
.quick-access { padding-bottom: 36px; }
.knowledge-section { border-top: 1px solid #dfe6dc; padding: 34px 0 42px; scroll-margin-top: 20px; }
.section-description { font-size: 13px; margin-bottom: 17px; line-height: 1.5; }
.entry-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.entry-card { display: flex; flex-direction: column; min-height: 150px; padding: 17px; border: 1px solid #dfe7dc; border-radius: 8px; background: #fff; text-decoration: none; transition: border-color .15s, transform .15s; }
.entry-card:hover { border-color: #b8ce65; transform: translateY(-1px); }
.entry-card.featured { min-height: 175px; background: #fbfcf8; }
.entry-category { color: #6c8b2a; font-size: 9px; letter-spacing: 1px; font-weight: 700; text-transform: uppercase; }
.entry-card h4 { color: #315d4e; font: 600 16px 'Space Grotesk'; margin: 8px 0 6px; }
.entry-card p { color: #718078; font-size: 12px; line-height: 1.5; margin: 0; }
.open-link { margin-top: auto; padding-top: 15px; color: #69832f; font-size: 11px; font-weight: 700; }
@media (max-width: 760px) { .knowledge-header { align-items: flex-start; flex-direction: column; }.workspace { display: block; }.sidebar-panel { border-right: 0; border-bottom: 1px solid #dfe6dc; padding: 0 0 10px; margin-bottom: 28px; }.sidebar-panel nav { display: flex; overflow-x: auto; gap: 3px; }.side-link { white-space: nowrap; border-left: 0; border-bottom: 2px solid transparent; }.entry-grid { grid-template-columns: 1fr; }.section-title { align-items: flex-start; flex-direction: column; } }
</style>
