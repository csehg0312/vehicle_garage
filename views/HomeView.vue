<template>
	<section class="home-view">
		<span class="eyebrow">{{ t('home.eyebrow') }}</span>
		<h2>{{ t('home.title') }}</h2>
		<p>{{ t('home.description') }}</p>
		<div class="home-actions"><RouterLink to="/garage" class="button button-primary">{{ t('home.open') }}</RouterLink><RouterLink to="/manuals/honda-civic-2001-2005" class="button button-outline">{{ t('home.manual') }}</RouterLink></div>
	</section>
</template>

<script setup lang="ts">
import { useI18n } from '../services/i18n'
const { t } = useI18n()
</script>

<style scoped>
.home-view { max-width: 720px; padding: 70px 0; }.eyebrow { color: var(--muted); font-size: 10px; letter-spacing: 1.7px; font-weight: 700; }.home-view h2 { max-width: 620px; color: var(--brand); font: 700 clamp(38px, 6vw, 72px) 'Space Grotesk'; letter-spacing: -3px; line-height: .98; margin: 16px 0 20px; }.home-view p { max-width: 520px; color: var(--muted); font-size: 17px; line-height: 1.6; }.home-actions { display: flex; gap: 10px; margin-top: 30px; }.button { border-radius: 7px; padding: 12px 17px; font-weight: 700; text-decoration: none; }.button-primary { background: var(--accent); color: var(--accent-ink); }.button-outline { border: 1px solid var(--line); color: var(--brand-soft); }
@media (max-width: 600px) { .home-view { padding: 36px 0; }.home-view h2 { letter-spacing: -1.8px; }.home-actions { flex-direction: column; }.home-actions a { text-align: center; } }
</style>
