import { describe, expect, it } from 'vitest'
import {
  isShiftCandidateDirection,
  isTelemetryEventType,
  isVehicleState,
  TELEMETRY_EVENT_TYPES,
  VEHICLE_STATES,
} from '../../../models/hondadriveTelemetry'
import type { TelemetrySample } from '../../../models/hondadriveTelemetry'

describe('HondaDrive telemetry domain model', () => {
  it('defines the complete state vocabulary used by the StateEngine', () => {
    expect(VEHICLE_STATES).toEqual([
      'UNKNOWN',
      'IDLE',
      'ACCELERATION',
      'CRUISING',
      'DECELERATION',
      'COASTING_NEUTRAL',
      'HIGH_LOAD',
      'SHIFTING',
    ])
  })

  it('accepts zero-valued measurements without treating them as missing', () => {
    const sample: TelemetrySample = {
      sequence: 42,
      timestampMs: 1_757_000_000_000,
      gps: {
        latitude: 48.55,
        longitude: 20.46,
        speedKph: 0,
      },
      obd: {
        rpm: 0,
        speedKph: 0,
        throttlePercent: 0,
        shortFuelTrimPercent: 0,
      },
      derived: {
        estimatedPowerKw: 0,
        estimatedTorqueNm: 0,
      },
    }

    expect(sample.gps?.speedKph).toBe(0)
    expect(sample.obd?.rpm).toBe(0)
    expect(sample.derived?.estimatedPowerKw).toBe(0)
  })

  it('keeps GPS, OBD and derived telemetry independently optional', () => {
    const gpsOnly: TelemetrySample = {
      sequence: 1,
      timestampMs: 1,
      gps: { latitude: 48.55, longitude: 20.46 },
    }
    const obdOnly: TelemetrySample = {
      sequence: 2,
      timestampMs: 2,
      obd: { rpm: 900 },
    }

    expect(gpsOnly.obd).toBeUndefined()
    expect(obdOnly.gps).toBeUndefined()
    expect(gpsOnly.derived).toBeUndefined()
  })

  it('validates enum values at runtime', () => {
    expect(isVehicleState('CRUISING')).toBe(true)
    expect(isVehicleState('NOT_A_STATE')).toBe(false)
    expect(isTelemetryEventType('SHIFT_CANDIDATE')).toBe(true)
    expect(isTelemetryEventType('OTHER')).toBe(false)
    expect(isShiftCandidateDirection('UP')).toBe(true)
    expect(isShiftCandidateDirection('SIDEWAYS')).toBe(false)
  })
})
