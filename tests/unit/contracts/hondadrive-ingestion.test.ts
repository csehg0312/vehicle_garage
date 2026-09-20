import { describe, expect, it } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import {
  HondaDriveTelemetryIngestionService,
  type TelemetryFrameRepository,
} from '../../../contracts/hondadrive/ingestion'

const frame: TelemetryFrame = {
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence: 10,
  lastSequence: 10,
  sentAtMs: 1_757_000_000_000,
  schemaVersion: 1,
  samples: [{ sequence: 10, timestampMs: 1_757_000_000_000, obd: { rpm: 850 } }],
}

function createRepository(): TelemetryFrameRepository & { saved: TelemetryFrame[]; duplicates: boolean } {
  const saved: TelemetryFrame[] = []
  return {
    saved,
    duplicates: false,
    async hasFrame() {
      return this.duplicates
    },
    async saveFrame(value) {
      saved.push(value)
    },
  }
}

describe('HondaDrive telemetry ingestion', () => {
  it('persists an accepted frame and acknowledges its last sequence', async () => {
    const repository = createRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)

    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'accepted',
      acknowledgedSequence: 10,
    })
    expect(repository.saved).toEqual([frame])
  })

  it('does not persist duplicate frames', async () => {
    const repository = createRepository()
    repository.duplicates = true
    const service = new HondaDriveTelemetryIngestionService(repository)

    await expect(service.ingest(frame)).resolves.toEqual({
      status: 'duplicate',
      acknowledgedSequence: 10,
    })
    expect(repository.saved).toHaveLength(0)
  })

  it('rejects invalid frames before repository access', async () => {
    const repository = createRepository()
    const service = new HondaDriveTelemetryIngestionService(repository)
    const invalid = { ...frame, firstSequence: 11 }

    await expect(service.ingest(invalid)).rejects.toThrow('Invalid HondaDrive telemetry frame')
    expect(repository.saved).toHaveLength(0)
  })
})
