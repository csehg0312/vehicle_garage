import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import {
  applyTelemetryFrame,
  createTelemetryCursor,
  type TelemetryCursorState,
} from '../../../contracts/hondadrive/cursor'

const makeFrame = (firstSequence: number, lastSequence: number): TelemetryFrame => ({
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence,
  lastSequence,
  sentAtMs: 1_757_000_000_000 + firstSequence * 1000,
  schemaVersion: 1,
  samples: Array.from({ length: lastSequence - firstSequence + 1 }, (_, index) => ({
    sequence: firstSequence + index,
    timestampMs: 1_757_000_000_000 + (firstSequence + index) * 1000,
  })),
})

const initial = (): TelemetryCursorState => ({
  cursor: createTelemetryCursor('trip-001'),
  gaps: [],
})

describe('HondaDrive telemetry cursor', () => {
  it('acknowledges the first contiguous frame', () => {
    const result = applyTelemetryFrame(initial(), makeFrame(0, 49))
    expect(result.cursor.acknowledgedSequence).toBe(49)
    expect(result.cursor.nextSequence).toBe(50)
    expect(result.gaps).toEqual([])
  })

  it('records a gap when a later frame arrives first', () => {
    const result = applyTelemetryFrame(initial(), makeFrame(50, 99))
    expect(result.cursor.acknowledgedSequence).toBe(-1)
    expect(result.cursor.nextSequence).toBe(100)
    expect(result.gaps).toEqual([{ fromSequence: 0, toSequence: 49 }])
  })

  it('closes a previously recorded gap', () => {
    const afterLater = applyTelemetryFrame(initial(), makeFrame(50, 99))
    const result = applyTelemetryFrame(afterLater, makeFrame(0, 49))

    expect(result.cursor.acknowledgedSequence).toBe(99)
    expect(result.cursor.nextSequence).toBe(100)
    expect(result.gaps).toEqual([])
  })

  it('does not move the cursor backwards for duplicate delivery', () => {
    const state = applyTelemetryFrame(initial(), makeFrame(0, 49))
    const result = applyTelemetryFrame(state, makeFrame(0, 49))

    expect(result.cursor.acknowledgedSequence).toBe(49)
    expect(result.cursor.nextSequence).toBe(50)
    expect(result.gaps).toEqual([])
  })

  it('tracks multiple gaps and merges overlapping ranges', () => {
    let state = initial()
    state = applyTelemetryFrame(state, makeFrame(100, 149))
    state = applyTelemetryFrame(state, makeFrame(200, 249))

    expect(state.gaps).toEqual([
      { fromSequence: 0, toSequence: 99 },
      { fromSequence: 150, toSequence: 199 },
    ])

    state = applyTelemetryFrame(state, makeFrame(150, 199))
    expect(state.gaps).toEqual([{ fromSequence: 0, toSequence: 99 }])
    expect(state.cursor.acknowledgedSequence).toBe(-1)

    state = applyTelemetryFrame(state, makeFrame(0, 99))
    expect(state.gaps).toEqual([])
    expect(state.cursor.acknowledgedSequence).toBe(249)
  })

  it('rejects a frame from another trip', () => {
    const state = initial()
    expect(() => applyTelemetryFrame(state, { ...makeFrame(0, 9), tripId: 'other-trip' }))
      .toThrow('Telemetry frame belongs to a different trip')
  })
})
