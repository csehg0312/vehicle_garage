<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">VG</span>
        <span>{{ t('brand.name') }}</span>
      </div>

      <AppNavigation />

      <div class="sidebar-note">
        <span class="status-dot"></span>
        <span>{{ t('nav.local') }}<br><small>{{ t('nav.saved') }}</small></span>
      </div>
    </aside>

    <div class="page-wrap">
      <header class="topbar">
        <div>
          <span class="eyebrow">{{ t('top.eyebrow') }}</span>
          <h1>{{ t('top.title') }}</h1>
        </div>

        <div class="topbar-actions">
          <label class="language-picker">
            {{ t('language.label') }}
            <select v-model="locale" @change="setLocale(locale)">
              <option v-for="option in locales" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <button class="avatar" :aria-label="t('nav.profile')">CG</button>
        </div>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from './components/base/AppNavigation.vue'
import { useI18n } from './services/i18n'

const { t, locale, locales, setLocale } = useI18n()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: var(--canvas);
  font-synthesis: none;
  --canvas: #f3f5ef;
  --surface: #ffffff;
  --surface-muted: #eaf0e8;
  --ink: #1d2925;
  --muted: #718078;
  --line: #dce5da;
  --brand: #173b32;
  --brand-soft: #2b594b;
  --accent: #d7e96e;
  --accent-ink: #25453b;
  --focus: #86a83e;
  --danger: #a23f35;
  --shadow: 0 16px 34px rgba(30, 58, 46, .08);
}

* { box-sizing: border-box; }

html {
  min-width: 320px;
  background: var(--canvas);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button, input, select, a { font: inherit; }

button:focus-visible,
input:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

.app-shell {
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 10;
  background: var(--brand);
  color: #e5eee4;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk';
  font-weight: 600;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  color: var(--brand);
  background: var(--accent);
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
}

.sidebar .app-navigation {
  margin-top: 60px;
}

.sidebar-note {
  margin-top: auto;
  display: flex;
  gap: 9px;
  align-items: center;
  font-size: 12px;
  color: #b4c9bd;
  border-top: 1px solid #386052;
  padding-top: 18px;
}

.sidebar-note small { color: #829f91; }

.status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  background: #b9d849;
  border-radius: 50%;
}

.page-wrap {
  min-width: 0;
  margin-left: 240px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 42px clamp(24px, 5vw, 72px) 26px;
  background: color-mix(in srgb, var(--surface) 88%, var(--canvas));
  border-bottom: 1px solid var(--line);
}

.eyebrow {
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 1.7px;
  font-weight: 700;
}

.topbar h1 {
  font-family: 'Space Grotesk';
  font-size: clamp(24px, 3vw, 36px);
  margin: 10px 0 0;
  letter-spacing: -1.5px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-picker {
  display: grid;
  gap: 4px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
}

.language-picker select {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 8px;
  background: var(--surface);
  color: var(--ink);
}

.avatar {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: var(--surface-muted);
  color: var(--brand-soft);
  font-size: 12px;
  font-weight: 700;
}

.content {
  max-width: 1240px;
  padding: 36px clamp(24px, 5vw, 72px) 72px;
}

.manual-page, .knowledge-home, .knowledge-entry { color: var(--ink) !important; }
.manual-page .manual-section, .knowledge-home .knowledge-section, .knowledge-entry .entry-header { border-color: var(--line) !important; }
.manual-page .manual-nav-link:hover, .manual-page .manual-nav-link.active, .knowledge-home .side-link:hover, .knowledge-home .entry-card:hover, .knowledge-entry .related-list a:hover { background: var(--surface-muted) !important; }
.manual-page .manual-nav-link, .knowledge-home .side-link, .knowledge-home .entry-card p, .knowledge-entry .entry-header p { color: var(--muted) !important; }
.manual-page .source-button, .knowledge-home .entry-card h4, .knowledge-entry .aside-card h3, .knowledge-entry .related-list a { color: var(--brand-soft) !important; }
.manual-page .variant-badge, .manual-page .section-count, .knowledge-home .variant-badge, .knowledge-home .section-count { color: var(--accent-ink) !important; background: var(--surface-muted) !important; }
.manual-page .component-card, .manual-page .source-list a, .knowledge-home .entry-card, .knowledge-entry .claim-card, .knowledge-entry .aside-card { border-color: var(--line) !important; background: var(--surface) !important; box-shadow: var(--shadow); }

@media (max-width: 767px) {
  .app-shell {
    display: block;
  }

  .sidebar {
    position: static;
    width: 100%;
    height: 56px;
    padding: 10px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .sidebar .app-navigation,
  .sidebar-note {
    display: none;
  }

  .brand {
    min-width: 0;
  }

  .brand > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-wrap {
    margin-left: 0;
  }

  .topbar {
    padding: 20px 16px 18px;
    align-items: center;
    gap: 12px;
  }

  .topbar > div:first-child {
    min-width: 0;
  }

  .topbar h1 {
    margin-top: 6px;
    font-size: 23px;
    letter-spacing: -.8px;
  }

  .topbar-actions {
    flex: 0 0 auto;
  }

  .language-picker {
    position: relative;
  }

  .language-picker select {
    max-width: 86px;
    padding: 7px 5px;
  }

  .content {
    width: 100%;
    max-width: none;
    padding: 20px 16px calc(88px + env(safe-area-inset-bottom));
  }
}

@media (min-width: 768px) {
  .app-navigation {
    display: grid;
  }
}
</style>
