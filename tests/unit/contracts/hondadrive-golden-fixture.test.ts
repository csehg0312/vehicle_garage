import { describe, expect, it } from 'vitest'
import fixture from '../../fixtures/hondadrive/telemetry-frame-v1.json'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import { fromWireFrame, toWireFrame } from '../../../contracts/hondadrive/mapping'

describe('HondaDrive golden telemetry fixture', () => {
  it('round-trips representative data from a real HondaDrive trip', () => {
    const frame = fixture as TelemetryFrame
    const wire = toWireFrame(frame)
    const decoded = fromWireFrame(wire)

    expect(toWireFrame(decoded)).toEqual(wire)
    expect(decoded.tripId).toBe(frame.tripId)
    expect(decoded.samples).toHaveLength(frame.samples.length)
    expect(decoded.samples[0].gps?.latitude).toBeCloseTo(frame.samples[0].gps!.latitude, 7)
    expect(decoded.samples[0].obd?.rpm).toBeCloseTo(frame.samples[0].obd!.rpm!, 1)
  })

  it('contains the expected realtime contract coverage', () => {
    const frame = fixture as TelemetryFrame

    expect(frame.samples).toHaveLength(5)
    expect(frame.samples.some(sample => sample.gps)).toBe(true)
    expect(frame.samples.some(sample => sample.obd)).toBe(true)
    expect(frame.samples.some(sample => sample.derived)).toBe(true)

    expect(frame.stateEstimates?.map(estimate => estimate.state)).toEqual([
      'CRUISING',
      'IDLE',
      'CRUISING',
      'HIGH_LOAD',
      'HIGH_LOAD',
    ])

    expect(frame.events?.[0]).toMatchObject({
      type: 'SHIFT_CANDIDATE',
      shiftCandidate: {
        direction: 'DOWN',
      },
    })
  })

  it('keeps source-data zero values distinct from missing measurements', () => {
    const frame = fixture as TelemetryFrame
    const first = frame.samples[0]

    expect(first.obd?.speedKph).toBe(0)
    expect(first.gps?.speedKph).toBe(0)
    expect(first.obd?.engineLoadPercent).toBeUndefined()
    expect(first.obd?.mapKpa).toBeUndefined()
  })
})
