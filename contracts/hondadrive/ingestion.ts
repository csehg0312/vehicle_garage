import type { TelemetryFrame } from '../../models/hondadriveTelemetry'
import { assertValidTelemetryFrame } from './validation'

export interface TelemetryFrameRepository {
  hasFrame(tripId: string, firstSequence: number, lastSequence: number): Promise<boolean>
  saveFrame(frame: TelemetryFrame): Promise<void>
}

export interface TelemetryIngestionResult {
  status: 'accepted' | 'duplicate'
  acknowledgedSequence: number
}

export class HondaDriveTelemetryIngestionService {
  constructor(private readonly repository: TelemetryFrameRepository) {}

  async ingest(frame: TelemetryFrame): Promise<TelemetryIngestionResult> {
    assertValidTelemetryFrame(frame)

    const duplicate = await this.repository.hasFrame(
      frame.tripId,
      frame.firstSequence,
      frame.lastSequence,
    )

    if (duplicate) {
      return {
        status: 'duplicate',
        acknowledgedSequence: frame.lastSequence,
      }
    }

    await this.repository.saveFrame(frame)

    return {
      status: 'accepted',
      acknowledgedSequence: frame.lastSequence,
    }
  }
}
