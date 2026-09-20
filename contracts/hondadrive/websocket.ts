import type { TelemetryFrame } from '../../models/hondadriveTelemetry'
import type { HondaDriveTelemetryIngestionService } from './ingestion'
import { createTelemetryAck, type TelemetryAck } from './protocol'

export interface WebSocketLike {
  send(data: string): void
}

export interface TelemetryFrameMessage {
  type: 'TELEMETRY_FRAME'
  frame: TelemetryFrame
}

export interface TelemetryErrorMessage {
  type: 'TELEMETRY_ERROR'
  tripId?: string
  message: string
}

export type HondaDriveServerMessage = TelemetryAck | TelemetryErrorMessage

export class HondaDriveWebSocketAdapter {
  constructor(
    private readonly ingestion: HondaDriveTelemetryIngestionService,
    private readonly now: () => number = () => Date.now(),
  ) {}

  async handleMessage(socket: WebSocketLike, rawMessage: string): Promise<void> {
    try {
      const message = parseTelemetryFrameMessage(rawMessage)
      const result = await this.ingestion.ingest(message.frame)

      socket.send(JSON.stringify(createTelemetryAck(
        message.frame.tripId,
        result.acknowledgedSequence,
        result.missingRanges,
      )))
    } catch (error) {
      const parsedTripId = tryReadTripId(rawMessage)
      socket.send(JSON.stringify({
        type: 'TELEMETRY_ERROR',
        ...(parsedTripId ? { tripId: parsedTripId } : {}),
        message: error instanceof Error ? error.message : 'Unknown telemetry ingestion error',
      } satisfies TelemetryErrorMessage))
    }
  }

  static encode(message: HondaDriveServerMessage): string {
    return JSON.stringify(message)
  }

  static decode(rawMessage: string): TelemetryFrameMessage {
    return parseTelemetryFrameMessage(rawMessage)
  }
}

function parseTelemetryFrameMessage(rawMessage: string): TelemetryFrameMessage {
  let value: unknown

  try {
    value = JSON.parse(rawMessage)
  } catch {
    throw new Error('Invalid WebSocket message: expected JSON')
  }

  if (!isRecord(value) || value.type !== 'TELEMETRY_FRAME' || !isRecord(value.frame)) {
    throw new Error('Invalid WebSocket message: expected TELEMETRY_FRAME')
  }

  return {
    type: 'TELEMETRY_FRAME',
    frame: value.frame as unknown as TelemetryFrame,
  }
}

function tryReadTripId(rawMessage: string): string | undefined {
  try {
    const value: unknown = JSON.parse(rawMessage)
    if (!isRecord(value) || !isRecord(value.frame) || typeof value.frame.tripId !== 'string') {
      return undefined
    }
    return value.frame.tripId
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function createTelemetryWebSocketAdapter(
  ingestion: HondaDriveTelemetryIngestionService,
): HondaDriveWebSocketAdapter {
  return new HondaDriveWebSocketAdapter(ingestion)
}
