import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import {
  HondaDriveTelemetryIngestionService,
} from '../../../contracts/hondadrive/ingestion'
import { InMemoryTelemetryFrameRepository } from '../../../contracts/hondadrive/repository'

const frame: TelemetryFrame = {
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence: 0,
  lastSequence: 1,
  sentAtMs: 1_757_000_000_000,
  schemaVersion: 1,
  samples: [
    { sequence: 0, timestampMs: 1_757_000_000_000, obd: { rpm: 850 } },
    { sequence: 1, timestampMs: 1_757_000_001_000, obd: { rpm: 1200 } },
  ],
}

describe('HondaDrive telemetry ingestion', () => {
  it('accepts and persists a new frame', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'accepted',
      acknowledgedSequence: 1,
      missingRanges: [],
    })
    expect(repository.getFrameCount()).toBe(1)
    expect(repository.getFrame('trip-001', 0, 1)).toEqual(frame)
  })

  it('accepts the same frame only once', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    await service.ingest(frame)
    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'duplicate',
      acknowledgedSequence: 1,
      missingRanges: [],
    })
    expect(repository.getFrameCount()).toBe(1)
  })

  it('keeps different sequence ranges distinct', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)
    const nextFrame: TelemetryFrame = {
      ...frame,
      firstSequence: 2,
      lastSequence: 3,
      samples: [
        { sequence: 2, timestampMs: 1_757_000_002_000, obd: { rpm: 1400 } },
        { sequence: 3, timestampMs: 1_757_000_003_000, obd: { rpm: 1600 } },
      ],
    }

    await service.ingest(frame)
    await service.ingest(nextFrame)
    expect(repository.getFrameCount()).toBe(2)
  })

  it('reports missing ranges until an out-of-order frame closes the gap', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    const laterFrame: TelemetryFrame = {
      ...frame,
      firstSequence: 4,
      lastSequence: 5,
      samples: [
        { sequence: 4, timestampMs: 1_757_000_004_000 },
        { sequence: 5, timestampMs: 1_757_000_005_000 },
      ],
    }

    const firstAck = await service.ingest(laterFrame)
    expect(firstAck.acknowledgedSequence).toBe(-1)
    expect(firstAck.missingRanges).toEqual([{ fromSequence: 0, toSequence: 3 }])

    const secondAck = await service.ingest(frame)
    expect(secondAck.acknowledgedSequence).toBe(1)
    expect(secondAck.missingRanges).toEqual([{ fromSequence: 2, toSequence: 3 }])
  })

  it('does not persist invalid frames', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)
    const invalid = { ...frame, firstSequence: 1 }

    await expect(service.ingest(invalid)).rejects.toThrow('Invalid HondaDrive telemetry frame')
    expect(repository.getFrameCount()).toBe(0)
  })
})
