<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface VehiclePanelRect {
  x: number
  y: number
  width: number
  height: number
}

type Interaction = 'move' | 'resize' | null

const props = withDefaults(
  defineProps<{
    title: string
    modelValue?: VehiclePanelRect
    minWidth?: number
    minHeight?: number
    gridSize?: number
    collisionRects?: VehiclePanelRect[]
    movable?: boolean
  }>(),
  {
    minWidth: 220,
    minHeight: 140,
    gridSize: 1,
    collisionRects: () => [],
    movable: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: VehiclePanelRect]
}>()

const panel = ref<HTMLElement | null>(null)
const fallbackRect: VehiclePanelRect = { x: 16, y: 16, width: 280, height: 180 }
const interaction = ref<Interaction>(null)
const active = ref(false)
const compactViewport = ref(false)
const start = ref<{ clientX: number; clientY: number; rect: VehiclePanelRect } | null>(null)
let compactQuery: MediaQueryList | null = null

const panelStyle = computed(() => ({
  left: `${(props.modelValue ?? fallbackRect).x}px`,
  top: `${(props.modelValue ?? fallbackRect).y}px`,
  width: `${(props.modelValue ?? fallbackRect).width}px`,
  height: `${(props.modelValue ?? fallbackRect).height}px`,
}))

function getBounds() {
  const element = panel.value?.offsetParent as HTMLElement | null
  return element ?? panel.value?.parentElement ?? null
}

function limit(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum))
}

function snap(value: number) {
  return Math.round(value / props.gridSize) * props.gridSize
}

function collides(rect: VehiclePanelRect) {
  return props.collisionRects.some((other) =>
    rect.x < other.x + other.width &&
    rect.x + rect.width > other.x &&
    rect.y < other.y + other.height &&
    rect.y + rect.height > other.y,
  )
}

function begin(event: PointerEvent, type: Exclude<Interaction, null>) {
  if (event.button !== 0 || !props.movable || compactViewport.value) return

  interaction.value = type
  active.value = true
  start.value = {
    clientX: event.clientX,
    clientY: event.clientY,
    rect: { ...(props.modelValue ?? fallbackRect) },
  }
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture?.(event.pointerId)
  event.preventDefault()
}

function move(event: PointerEvent) {
  if (!interaction.value || !start.value) return

  const bounds = getBounds()
  if (!bounds) return

  const deltaX = event.clientX - start.value.clientX
  const deltaY = event.clientY - start.value.clientY
  const original = start.value.rect

  if (interaction.value === 'move') {
    const next = {
      ...original,
      x: limit(snap(original.x + deltaX), 0, bounds.clientWidth - original.width),
      y: limit(snap(original.y + deltaY), 0, bounds.clientHeight - original.height),
    }
    if (!collides(next)) emit('update:modelValue', next)
    return
  }

  const next = {
    ...original,
    width: limit(snap(original.width + deltaX), props.minWidth, bounds.clientWidth - original.x),
    height: limit(snap(original.height + deltaY), props.minHeight, bounds.clientHeight - original.y),
  }
  if (!collides(next)) emit('update:modelValue', next)
}

function end() {
  interaction.value = null
  active.value = false
  start.value = null
}

function updateCompactViewport() { compactViewport.value = compactQuery?.matches ?? false }
onMounted(() => { compactQuery = window.matchMedia('(max-width: 680px)'); updateCompactViewport(); compactQuery.addEventListener('change', updateCompactViewport) })
onBeforeUnmount(() => { compactQuery?.removeEventListener('change', updateCompactViewport); end() })
</script>

<template>
  <article
    ref="panel"
    class="vehicle-movable-panel"
    :class="{ 'is-active': active }"
    :style="panelStyle"
  >
    <header
      class="vehicle-movable-panel-header"
      tabindex="0"
      @pointerdown="begin($event, 'move')"
      @pointermove="move"
      @pointerup="end"
      @pointercancel="end"
    >
      <h3>{{ title }}</h3>
      <span v-if="movable" class="vehicle-movable-panel-hint">Drag</span>
    </header>

    <div class="vehicle-movable-panel-content">
      <slot />
    </div>

    <button
      class="vehicle-movable-panel-resize"
      type="button"
      aria-label="Resize panel"
      @pointerdown="begin($event, 'resize')"
      @pointermove="move"
      @pointerup="end"
      @pointercancel="end"
    />
  </article>
</template>

<style scoped>
.vehicle-movable-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border, #dbe4dc);
  border-radius: 0.75rem;
  background: var(--color-surface, #fff);
  box-shadow: 0 0.4rem 1.5rem rgb(25 55 35 / 12%);
  user-select: none;
}

.vehicle-movable-panel.is-active {
  z-index: 2;
  border-color: var(--color-primary, #246b45);
  box-shadow: 0 0.6rem 1.8rem rgb(25 55 35 / 20%);
}

.vehicle-movable-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.6rem 0.8rem;
  background: var(--color-surface-muted, #f2f7f2);
  cursor: grab;
  touch-action: none;
}

.vehicle-movable-panel-header:active {
  cursor: grabbing;
}

.vehicle-movable-panel-header h3 {
  margin: 0;
  font-size: 0.95rem;
}

.vehicle-movable-panel-hint {
  color: var(--color-muted, #647064);
  font-size: 0.75rem;
}

.vehicle-movable-panel-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.8rem;
  user-select: text;
}

.vehicle-movable-panel-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1rem;
  height: 1rem;
  border: 0;
  background: linear-gradient(135deg, transparent 45%, var(--color-primary, #246b45) 46%, transparent 54%);
  cursor: nwse-resize;
  touch-action: none;
}

@media (max-width: 680px) {
  .vehicle-movable-panel-header { min-height: 3rem; padding: 0.65rem 0.75rem; }
  .vehicle-movable-panel-content { padding: 0.7rem; }
  .vehicle-movable-panel-resize { width: 1.35rem; height: 1.35rem; }
}
</style>
