import type { TelemetryFrame } from '../../models/hondadriveTelemetry'

export type TelemetryFrameAcceptance =
  | { status: 'accepted'; acknowledgedSequence: number }
  | { status: 'duplicate'; acknowledgedSequence: number }

export interface TelemetryFrameRepository {
  acceptFrame(frame: TelemetryFrame): Promise<TelemetryFrameAcceptance>
}

export class InMemoryTelemetryFrameRepository implements TelemetryFrameRepository {
  private readonly frames = new Map<string, TelemetryFrame>()

  async acceptFrame(frame: TelemetryFrame): Promise<TelemetryFrameAcceptance> {
    const key = this.frameKey(frame)
    const existing = this.frames.get(key)

    if (existing) {
      return { status: 'duplicate', acknowledgedSequence: existing.lastSequence }
    }

    this.frames.set(key, frame)
    return { status: 'accepted', acknowledgedSequence: frame.lastSequence }
  }

  getFrameCount(): number {
    return this.frames.size
  }

  getFrame(tripId: string, firstSequence: number, lastSequence: number): TelemetryFrame | undefined {
    return this.frames.get(`${tripId}:${firstSequence}:${lastSequence}`)
  }

  private frameKey(frame: Pick<TelemetryFrame, 'tripId' | 'firstSequence' | 'lastSequence'>): string {
    return `${frame.tripId}:${frame.firstSequence}:${frame.lastSequence}`
  }
}
