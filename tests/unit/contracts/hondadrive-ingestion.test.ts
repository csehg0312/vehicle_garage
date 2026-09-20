import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import { HondaDriveTelemetryIngestionService } from '../../../contracts/hondadrive/ingestion'
import { InMemoryTelemetryFrameRepository } from '../../../contracts/hondadrive/repository'

const frame: TelemetryFrame = {
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence: 10,
  lastSequence: 11,
  sentAtMs: 1_757_000_000_000,
  schemaVersion: 1,
  samples: [
    { sequence: 10, timestampMs: 1_757_000_000_000, obd: { rpm: 850 } },
    { sequence: 11, timestampMs: 1_757_000_001_000, obd: { rpm: 1200 } },
  ],
}

describe('HondaDrive telemetry ingestion', () => {
  it('accepts and persists a new frame', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'accepted',
      acknowledgedSequence: 11,
    })
    expect(repository.getFrameCount()).toBe(1)
    expect(repository.getFrame('trip-001', 10, 11)).toEqual(frame)
  })

  it('accepts the same frame only once', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    await service.ingest(frame)
    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'duplicate',
      acknowledgedSequence: 11,
    })
    expect(repository.getFrameCount()).toBe(1)
  })

  it('keeps different sequence ranges distinct', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)
    const nextFrame: TelemetryFrame = {
      ...frame,
      firstSequence: 12,
      lastSequence: 13,
      samples: [
        { sequence: 12, timestampMs: 1_757_000_002_000, obd: { rpm: 1400 } },
        { sequence: 13, timestampMs: 1_757_000_003_000, obd: { rpm: 1600 } },
      ],
    }

    await service.ingest(frame)
    await service.ingest(nextFrame)
    expect(repository.getFrameCount()).toBe(2)
  })

  it('does not persist invalid frames', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)
    const invalid = { ...frame, firstSequence: 11 }

    await expect(service.ingest(invalid)).rejects.toThrow('Invalid HondaDrive telemetry frame')
    expect(repository.getFrameCount()).toBe(0)
  })

  it('keeps ACK semantics stable across duplicate delivery', async () => {
    const repository = new InMemoryTelemetryFrameRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    const first = await service.ingest(frame)
    const second = await service.ingest(frame)

    expect(first.acknowledgedSequence).toBe(11)
    expect(second.acknowledgedSequence).toBe(11)
    expect(first.status).toBe('accepted')
    expect(second.status).toBe('duplicate')
  })
})
