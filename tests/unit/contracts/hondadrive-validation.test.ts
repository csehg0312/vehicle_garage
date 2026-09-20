import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import { validateTelemetryFrame } from '../../../contracts/hondadrive/validation'

const validFrame: TelemetryFrame = {
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence: 10,
  lastSequence: 11,
  sentAtMs: 1_757_000_000_000,
  schemaVersion: 1,
  samples: [
    { sequence: 10, timestampMs: 1_757_000_000_000, obd: { rpm: 850 } },
    { sequence: 11, timestampMs: 1_757_000_001_000, gps: { latitude: 48.55, longitude: 20.46 } },
  ],
}

describe('HondaDrive telemetry validation', () => {
  it('accepts a valid contiguous frame', () => {
    expect(validateTelemetryFrame(validFrame)).toEqual({ valid: true, errors: [] })
  })

  it('rejects an unsupported schema version', () => {
    const result = validateTelemetryFrame({ ...validFrame, schemaVersion: 2 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('unsupported schemaVersion: 2')
  })

  it('rejects a sequence range that does not match samples', () => {
    const result = validateTelemetryFrame({ ...validFrame, lastSequence: 12 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('sample sequence range does not match sample count')
  })

  it('rejects a gap in sample sequences', () => {
    const result = validateTelemetryFrame({
      ...validFrame,
      samples: [
        validFrame.samples[0],
        { ...validFrame.samples[1], sequence: 12 },
      ],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some((error) => error.includes('does not match expected 11'))).toBe(true)
  })

  it('rejects confidence outside the domain range', () => {
    const result = validateTelemetryFrame({
      ...validFrame,
      stateEstimates: [{ timestampMs: 1, state: 'CRUISING', confidence: 1.2 }],
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('stateEstimates[0] confidence must be between 0 and 1')
  })
})
