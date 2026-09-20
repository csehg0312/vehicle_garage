import type { TelemetryFrame } from '../../models/hondadriveTelemetry'
import { assertValidTelemetryFrame } from './validation'
import type { TelemetryFrameAcceptance, TelemetryFrameRepository } from './repository'

export type TelemetryIngestionResult = TelemetryFrameAcceptance

export class HondaDriveTelemetryIngestionService {
  constructor(private readonly repository: TelemetryFrameRepository) {}

  async ingest(frame: TelemetryFrame): Promise<TelemetryIngestionResult> {
    assertValidTelemetryFrame(frame)
    return this.repository.acceptFrame(frame)
  }
}
