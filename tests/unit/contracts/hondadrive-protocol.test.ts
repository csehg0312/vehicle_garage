import { describe, expect, it } from 'vitest'
import { createTelemetryAck } from '../../../contracts/hondadrive/protocol'

describe('HondaDrive telemetry ACK protocol', () => {
  it('creates a transport-ready ACK with missing ranges', () => {
    const ack = createTelemetryAck('trip-001', 49, [
      { fromSequence: 50, toSequence: 59 },
      { fromSequence: 70, toSequence: 72 },
    ])

    expect(ack).toEqual({
      type: 'TELEMETRY_ACK',
      tripId: 'trip-001',
      acknowledgedSequence: 49,
      missingRanges: [
        { fromSequence: 50, toSequence: 59 },
        { fromSequence: 70, toSequence: 72 },
      ],
    })
  })

  it('does not expose mutable range references', () => {
    const ranges = [{ fromSequence: 0, toSequence: 9 }]
    const ack = createTelemetryAck('trip-001', -1, ranges)

    ranges[0].toSequence = 99

    expect(ack.missingRanges).toEqual([{ fromSequence: 0, toSequence: 9 }])
  })
})
