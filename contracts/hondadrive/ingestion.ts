import type { TelemetryFrame } from '../../models/hondadriveTelemetry'
import { assertValidTelemetryFrame } from './validation'
import type { TelemetryFrameAcceptance, TelemetryFrameRepository } from './repository'
import {
  applyTelemetryFrame,
  createTelemetryCursorState,
  InMemoryTelemetryCursorRepository,
  type TelemetryCursorRepository,
} from './cursor'
import { createTelemetryAck, type TelemetryAck } from './protocol'

export type TelemetryIngestionResult = TelemetryFrameAcceptance & {
  missingRanges: TelemetryAck['missingRanges']
}

export class HondaDriveTelemetryIngestionService {
  constructor(
    private readonly repository: TelemetryFrameRepository,
    private readonly cursorRepository: TelemetryCursorRepository = new InMemoryTelemetryCursorRepository(),
  ) {}

  async ingest(frame: TelemetryFrame): Promise<TelemetryIngestionResult> {
    assertValidTelemetryFrame(frame)

    const acceptance = await this.repository.acceptFrame(frame)
    const current = await this.cursorRepository.get(frame.tripId)
    const nextState = applyTelemetryFrame(
      current ?? createTelemetryCursorState(frame.tripId),
      frame,
    )

    await this.cursorRepository.save(nextState)

    const ack = createTelemetryAck(
      frame.tripId,
      nextState.cursor.acknowledgedSequence,
      nextState.gaps,
    )

    return {
      ...acceptance,
      acknowledgedSequence: ack.acknowledgedSequence,
      missingRanges: ack.missingRanges,
    }
  }
}
