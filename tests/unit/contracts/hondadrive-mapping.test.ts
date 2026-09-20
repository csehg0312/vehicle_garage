import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import {
  fromWireFrame,
  toWireFrame,
  toWireObd,
} from '../../../contracts/hondadrive/mapping'

describe('HondaDrive domain-wire mapping', () => {
  it('maps a representative frame without losing structure', () => {
    const frame: TelemetryFrame = {
      tripId: 'trip-001',
      vehicle: {
        vehicleId: 'civic-eu8',
        profileId: 'honda_civic_vii_d16v1',
      },
      firstSequence: 10,
      lastSequence: 11,
      sentAtMs: 1_757_000_000_000,
      schemaVersion: 1,
      samples: [
        {
          sequence: 10,
          timestampMs: 1_757_000_000_000,
          gps: {
            latitude: 48.55,
            longitude: 20.46,
            speedKph: 0,
          },
          obd: {
            rpm: 0,
            speedKph: 0,
            coolantCelsius: 91.2,
            shortFuelTrimPercent: -10.94,
            longFuelTrimPercent: 8.75,
          },
          derived: {
            estimatedPowerKw: 0,
            estimatedTorqueNm: 0,
          },
        },
        {
          sequence: 11,
          timestampMs: 1_757_000_001_000,
          obd: {
            rpm: 2430.7,
            engineLoadPercent: 34.2,
            throttlePercent: 21.1,
          },
        },
      ],
      stateEstimates: [
        {
          timestampMs: 1_757_000_000_000,
          state: 'IDLE',
          confidence: 0.9,
        },
      ],
      events: [
        {
          sequence: 11,
          timestampMs: 1_757_000_001_000,
          type: 'SHIFT_CANDIDATE',
          confidence: 0.875,
          shiftCandidate: {
            direction: 'UP',
            confidence: 0.95,
          },
        },
      ],
    }

    const wire = toWireFrame(frame)
    const decoded = fromWireFrame(wire)

    expect(toWireFrame(decoded)).toEqual(wire)
    expect(decoded.vehicle.vehicleId).toBe(frame.vehicle.vehicleId)
    expect(decoded.samples).toHaveLength(frame.samples.length)
    expect(decoded.samples[0].obd?.coolantCelsius).toBe(91.2)
  })

  it('preserves zero and missing values independently', () => {
    const wire = toWireObd({
      rpm: 0,
      speedKph: undefined,
      throttlePercent: 0,
      shortFuelTrimPercent: 0,
    })

    expect(wire.rpm_x10).toBe(0)
    expect(wire.speed_kph_x10).toBeUndefined()
    expect(wire.throttle_percent_x10).toBe(0)
    expect(wire.short_fuel_trim_percent_x10).toBe(0)
  })

  it('preserves negative signed measurements', () => {
    const wire = toWireObd({
      shortFuelTrimPercent: -10.94,
      longFuelTrimPercent: -5.25,
      coolantCelsius: -2.1,
    })

    expect(wire.short_fuel_trim_percent_x10).toBe(-109)
    expect(wire.long_fuel_trim_percent_x10).toBe(-53)
    expect(wire.coolant_celsius_x10).toBe(-21)
  })

  it('keeps GPS-only and OBD-only samples independent', () => {
    const gpsOnly: TelemetryFrame = {
      tripId: 'gps-only',
      vehicle: { vehicleId: 'civic-eu8' },
      firstSequence: 1,
      lastSequence: 1,
      sentAtMs: 1,
      schemaVersion: 1,
      samples: [
        {
          sequence: 1,
          timestampMs: 1,
          gps: { latitude: 48.55, longitude: 20.46 },
        },
      ],
    }

    const obdOnly: TelemetryFrame = {
      ...gpsOnly,
      tripId: 'obd-only',
      samples: [{ sequence: 1, timestampMs: 1, obd: { rpm: 850 } }],
    }

    expect(fromWireFrame(toWireFrame(gpsOnly))).toEqual(gpsOnly)
    expect(fromWireFrame(toWireFrame(obdOnly))).toEqual(obdOnly)
  })
})
