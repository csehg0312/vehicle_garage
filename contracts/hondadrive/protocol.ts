import type { TelemetryGap } from './cursor'

export const HONDA_DRIVE_MESSAGE_TYPES = ['TELEMETRY_FRAME', 'TELEMETRY_ACK'] as const
export type HondaDriveMessageType = (typeof HONDA_DRIVE_MESSAGE_TYPES)[number]

export interface TelemetryAck {
  type: 'TELEMETRY_ACK'
  tripId: string
  acknowledgedSequence: number
  missingRanges: TelemetryGap[]
}

export function createTelemetryAck(
  tripId: string,
  acknowledgedSequence: number,
  missingRanges: TelemetryGap[],
): TelemetryAck {
  return {
    type: 'TELEMETRY_ACK',
    tripId,
    acknowledgedSequence,
    missingRanges: missingRanges.map((range) => ({ ...range })),
  }
}
