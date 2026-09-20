import type { TelemetryCursor, TelemetryFrame } from '../../models/hondadriveTelemetry'

export interface TelemetryGap {
  fromSequence: number
  toSequence: number
}

export interface TelemetryCursorState {
  cursor: TelemetryCursor
  gaps: TelemetryGap[]
}

export interface TelemetryCursorRepository {
  get(tripId: string): Promise<TelemetryCursorState | undefined>
  save(state: TelemetryCursorState): Promise<void>
}

export class InMemoryTelemetryCursorRepository implements TelemetryCursorRepository {
  private readonly states = new Map<string, TelemetryCursorState>()

  async get(tripId: string): Promise<TelemetryCursorState | undefined> {
    const state = this.states.get(tripId)
    return state ? cloneState(state) : undefined
  }

  async save(state: TelemetryCursorState): Promise<void> {
    this.states.set(state.cursor.tripId, cloneState(state))
  }
}

export function createTelemetryCursor(tripId: string): TelemetryCursor {
  return { tripId, nextSequence: 0, acknowledgedSequence: -1 }
}

export function createTelemetryCursorState(tripId: string): TelemetryCursorState {
  return { cursor: createTelemetryCursor(tripId), gaps: [] }
}

export function applyTelemetryFrame(
  state: TelemetryCursorState,
  frame: TelemetryFrame,
): TelemetryCursorState {
  if (state.cursor.tripId !== frame.tripId) {
    throw new Error('Telemetry frame belongs to a different trip')
  }

  let nextSequence = Math.max(state.cursor.nextSequence, frame.lastSequence + 1)
  let gaps = subtractRange(state.gaps, frame.firstSequence, frame.lastSequence)

  if (frame.firstSequence > state.cursor.nextSequence) {
    gaps = mergeGaps([
      ...gaps,
      { fromSequence: state.cursor.nextSequence, toSequence: frame.firstSequence - 1 },
    ])
  }

  const acknowledgedSequence = calculateAcknowledgedSequence(nextSequence, gaps)

  return {
    cursor: {
      ...state.cursor,
      nextSequence,
      acknowledgedSequence,
    },
    gaps,
  }
}

function calculateAcknowledgedSequence(nextSequence: number, gaps: TelemetryGap[]): number {
  if (gaps.length === 0) return nextSequence - 1
  return gaps[0].fromSequence - 1
}

function subtractRange(gaps: TelemetryGap[], from: number, to: number): TelemetryGap[] {
  return gaps.flatMap((gap) => {
    if (to < gap.fromSequence || from > gap.toSequence) return [gap]

    const result: TelemetryGap[] = []
    if (from > gap.fromSequence) {
      result.push({ fromSequence: gap.fromSequence, toSequence: from - 1 })
    }
    if (to < gap.toSequence) {
      result.push({ fromSequence: to + 1, toSequence: gap.toSequence })
    }
    return result
  })
}

function mergeGaps(gaps: TelemetryGap[]): TelemetryGap[] {
  return gaps
    .sort((a, b) => a.fromSequence - b.fromSequence)
    .reduce<TelemetryGap[]>((merged, gap) => {
      const previous = merged[merged.length - 1]
      if (!previous || gap.fromSequence > previous.toSequence + 1) {
        merged.push({ ...gap })
      } else {
        previous.toSequence = Math.max(previous.toSequence, gap.toSequence)
      }
      return merged
    }, [])
}

function cloneState(state: TelemetryCursorState): TelemetryCursorState {
  return {
    cursor: { ...state.cursor },
    gaps: state.gaps.map((gap) => ({ ...gap })),
  }
}
