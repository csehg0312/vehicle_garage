<script setup lang="ts">
import { useI18n } from '../../services/i18n'

const { t } = useI18n()

const navigationItems = [
  { to: '/garage', labelKey: 'nav.garage', icon: '▦' },
  { to: '/obd', labelKey: 'nav.obd', icon: '⌁' },
  { to: '/manuals/honda-civic-2001-2005', labelKey: 'nav.manual', icon: '◇' },
] as const
</script>

<template>
  <nav class="app-navigation" :aria-label="t('nav.main')">
    <RouterLink
      v-for="item in navigationItems"
      :key="item.to"
      :to="item.to"
      class="nav-link"
    >
      <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
      <span class="nav-label">{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: grid;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 10px 12px;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background .15s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: var(--brand-soft);
}

.nav-icon {
  display: grid;
  place-items: center;
  width: 24px;
  flex: 0 0 24px;
  color: var(--accent);
  font-size: 19px;
  line-height: 1;
}

.nav-label {
  white-space: nowrap;
}

@media (max-width: 767px) {
  .app-navigation {
    position: fixed;
    z-index: 20;
    right: 0;
    bottom: 0;
    left: 0;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    padding: 8px max(8px, env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-right));
    background: color-mix(in srgb, var(--brand) 96%, transparent);
    border-top: 1px solid #386052;
    box-shadow: 0 -10px 28px rgba(30, 58, 46, .12);
    backdrop-filter: blur(14px);
  }

  .nav-link {
    min-height: 52px;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 6px 4px;
    border-radius: 8px;
    font-size: 10px;
    line-height: 1.1;
    text-align: center;
  }

  .nav-icon {
    width: auto;
    flex-basis: auto;
    font-size: 20px;
  }
}
</style>
